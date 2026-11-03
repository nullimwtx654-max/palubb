import React, {useMemo} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react';

import {useTheme} from '../../hooks';
import {uiStore} from '../../store';
import {createStyles} from './styles';

interface GreetingBubbleProps {
  text: string;
  allGreetings?: string[];
  currentIndex?: number;
  onSelectIndex?: (index: number) => void;
}

/**
 * Non-persistent greeting rendered as a chat header for empty sessions.
 * Visually distinct from real assistant bubbles (italic, accent border, icon).
 * Supports cycling through multiple greetings (alternate_greetings) and frosted glass theme.
 */
export const GreetingBubble: React.FC<GreetingBubbleProps> = observer(
  ({text, allGreetings = [], currentIndex = 0, onSelectIndex}) => {
    const theme = useTheme();
    const isFancy = uiStore.palsHubFancyTheme;

    const styles = useMemo(
      () =>
        createStyles({
          background: theme.colors.surfaceVariant,
          border: theme.colors.outline,
          text: theme.colors.onSurfaceVariant,
          accent: theme.colors.primary,
          isFancyTheme: isFancy,
        }),
      [theme, isFancy],
    );

    const totalGreetings = Math.max(allGreetings.length, 1);
    const displayText =
      allGreetings.length > 0 && allGreetings[currentIndex]
        ? allGreetings[currentIndex]
        : text;

    const handlePrev = () => {
      if (!onSelectIndex || currentIndex <= 0) return;
      onSelectIndex(currentIndex - 1);
    };

    const handleNext = () => {
      if (!onSelectIndex || currentIndex >= totalGreetings - 1) return;
      onSelectIndex(currentIndex + 1);
    };

    return (
      <View style={styles.container} testID="greeting-bubble">
        <View style={styles.topRow}>
          <Text style={styles.icon}>👋</Text>
          <Text style={styles.text}>{displayText}</Text>
        </View>

        {totalGreetings > 1 && onSelectIndex && (
          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentIndex === 0 && styles.pageButtonDisabled,
              ]}
              disabled={currentIndex === 0}
              onPress={handlePrev}>
              <Text style={styles.pageButtonText}>◀</Text>
            </TouchableOpacity>

            <Text style={styles.pageIndicatorText}>
              {currentIndex + 1} / {totalGreetings}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                currentIndex >= totalGreetings - 1 && styles.pageButtonDisabled,
              ]}
              disabled={currentIndex >= totalGreetings - 1}
              onPress={handleNext}>
              <Text style={styles.pageButtonText}>▶</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);
