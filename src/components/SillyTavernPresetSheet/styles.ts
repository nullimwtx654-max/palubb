import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';

export const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 16,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.elevation.level1,
      borderRadius: 12,
      padding: 3,
      marginBottom: 8,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primaryContainer,
    },
    tabButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.onSurfaceVariant,
    },
    tabButtonTextActive: {
      color: theme.colors.onPrimaryContainer,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginTop: 8,
    },
    description: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 18,
    },
    presetCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      marginBottom: 8,
    },
    presetCardActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer + '20',
    },
    presetName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    presetDesc: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 8,
      marginVertical: 8,
    },
    actionButton: {
      flex: 1,
    },
    promptItem: {
      padding: 12,
      borderRadius: 10,
      backgroundColor: theme.colors.elevation.level1,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    promptItemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    promptItemName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    promptItemRole: {
      fontSize: 11,
      color: theme.colors.primary,
      textTransform: 'uppercase',
      fontWeight: '700',
    },
    promptItemContent: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginTop: 6,
    },
    sliderRow: {
      marginBottom: 12,
    },
    sliderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    sliderLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    sliderValue: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    footerActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 12,
    },
  });
