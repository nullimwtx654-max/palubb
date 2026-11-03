import {StyleSheet} from 'react-native';

export const createStyles = (colors: {
  background: string;
  border: string;
  text: string;
  accent: string;
  isFancyTheme?: boolean;
}) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
      marginHorizontal: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.isFancyTheme ? 'rgba(255, 255, 255, 0.25)' : colors.border,
      borderLeftWidth: 3,
      borderLeftColor: colors.accent,
      backgroundColor: colors.isFancyTheme
        ? 'rgba(30, 30, 35, 0.65)'
        : colors.background,
      flexDirection: 'column',
      gap: 8,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    icon: {
      fontSize: 16,
      marginTop: 1,
    },
    text: {
      flex: 1,
      fontStyle: 'italic',
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
    paginationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
      paddingTop: 4,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.isFancyTheme ? 'rgba(255, 255, 255, 0.15)' : colors.border,
    },
    pageButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: colors.isFancyTheme
        ? 'rgba(255, 255, 255, 0.12)'
        : colors.accent + '15',
    },
    pageButtonDisabled: {
      opacity: 0.3,
    },
    pageButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.accent,
    },
    pageIndicatorText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
      opacity: 0.8,
    },
  });
