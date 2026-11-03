import type {ReactNode} from 'react';
import React, {useContext} from 'react';
import {Animated} from 'react-native';
import {observer} from 'mobx-react';

import {useTheme} from '../../hooks';
import {uiStore} from '../../store';
import {styles} from './styles';

import {UserContext} from '../../utils';
import {MessageType} from '../../utils/types';

/**
 * Pure shape primitive (border, background, scale animation). Chrome —
 * timing, copy, and any other turn-level slots — is owned by
 * `AssistantTurnFooter` rendered adjacent to the Bubble by `Message`.
 * Supports frosted glass styling when PalsHub fancy theme is enabled.
 */
export const Bubble = observer(
  ({
    child,
    message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nextMessageInGroup,
    scale = new Animated.Value(1),
  }: {
    child: ReactNode;
    message: MessageType.Any;
    nextMessageInGroup: boolean;
    scale?: Animated.Value;
  }) => {
    const theme = useTheme();
    const user = useContext(UserContext);
    const currentUserIsAuthor = user?.id === message.author.id;
    const isFancy = uiStore.palsHubFancyTheme;

    const {contentContainer} = styles({
      currentUserIsAuthor,
      message,
      roundBorder: true,
      theme,
    });

    const fancyStyle = isFancy
      ? {
          backgroundColor: currentUserIsAuthor
            ? theme.dark
              ? 'rgba(45, 65, 105, 0.75)'
              : 'rgba(215, 235, 255, 0.8)'
            : theme.dark
            ? 'rgba(32, 32, 38, 0.65)'
            : 'rgba(255, 255, 255, 0.72)',
          borderColor: currentUserIsAuthor
            ? theme.colors.primary + '40'
            : theme.dark
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
        }
      : null;

    return (
      <Animated.View
        testID={currentUserIsAuthor ? 'user-message' : 'ai-message'}
        style={[contentContainer, fancyStyle, {transform: [{scale}]}]}>
        {child}
      </Animated.View>
    );
  },
);
