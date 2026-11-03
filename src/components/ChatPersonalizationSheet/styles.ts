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
      marginTop: 4,
    },
    description: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 18,
    },
    toneGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginVertical: 4,
    },
    toneChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surface,
    },
    toneChipActive: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primary,
    },
    toneChipText: {
      fontSize: 13,
      color: theme.colors.onSurface,
      fontWeight: '500',
    },
    toneChipTextActive: {
      color: theme.colors.onPrimaryContainer,
      fontWeight: '700',
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.outlineVariant,
    },
    switchTextContainer: {
      flex: 1,
      paddingRight: 12,
    },
    switchLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    switchDesc: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    memoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      borderRadius: 10,
      backgroundColor: theme.colors.elevation.level1,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    memoryText: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.onSurface,
      lineHeight: 18,
    },
    memoryMeta: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    addMemoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },
    chatSummaryCard: {
      padding: 12,
      borderRadius: 10,
      backgroundColor: theme.colors.elevation.level1,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    chatSummaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    chatSummaryTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary,
      flex: 1,
    },
    chatSummaryDate: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
    },
    chatSummaryBody: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 18,
    },
    footerActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 12,
    },
  });
