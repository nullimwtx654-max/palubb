import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';

export const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 16,
    },
    description: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    providerSelectorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginVertical: 4,
    },
    providerChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surface,
    },
    providerChipActive: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primary,
    },
    providerChipText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    providerChipTextActive: {
      color: theme.colors.onPrimaryContainer,
      fontWeight: '700',
    },
    inputSection: {
      gap: 12,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.onSurfaceVariant,
    },
    modelSelectContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 4,
    },
    modelChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.colors.elevation.level1,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    modelChipActive: {
      backgroundColor: theme.colors.secondaryContainer,
      borderColor: theme.colors.secondary,
    },
    modelChipText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    modelChipTextActive: {
      color: theme.colors.onSecondaryContainer,
      fontWeight: '600',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    saveButton: {
      minWidth: 100,
    },
    clearButton: {
      minWidth: 80,
    },
    testButton: {
      minWidth: 80,
    },
    errorSnackbar: {
      backgroundColor: theme.colors.errorContainer,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      fontSize: 11,
      fontWeight: '600',
      marginTop: 4,
    },
    statusConfigured: {
      backgroundColor: '#E8F5E9',
      color: '#2E7D32',
    },
    statusNotConfigured: {
      backgroundColor: '#FFF3E0',
      color: '#E65100',
    },
  });
