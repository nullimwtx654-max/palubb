import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {Text, Button, Snackbar, TextInput as PaperTextInput} from 'react-native-paper';
import {observer} from 'mobx-react';

import {Sheet, TextInput} from '..';
import {useTheme} from '../../hooks';
import {aiProviderStore} from '../../store';
import {EyeIcon, EyeOffIcon} from '../../assets/icons';
import {createStyles} from './styles';

interface AIApiKeySheetProps {
  isVisible: boolean;
  onDismiss: () => void;
  initialProviderId?: string;
}

export const AIApiKeySheet: React.FC<AIApiKeySheetProps> = observer(
  ({isVisible, onDismiss, initialProviderId}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [selectedProviderId, setSelectedProviderId] = useState<string>(
      initialProviderId || 'openai',
    );
    const [apiKey, setApiKey] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [activeModel, setActiveModel] = useState('');
    const [customModel, setCustomModel] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

    const activeProvider = aiProviderStore.providers.find(
      p => p.id === selectedProviderId,
    );

    useEffect(() => {
      if (isVisible) {
        const id = initialProviderId || selectedProviderId || 'openai';
        setSelectedProviderId(id);
        const prov = aiProviderStore.providers.find(p => p.id === id);
        if (prov) {
          setApiKey(prov.apiKey || '');
          setBaseUrl(prov.baseUrl || '');
          setActiveModel(prov.activeModel || prov.models[0] || '');
        }
      }
    }, [isVisible, initialProviderId, selectedProviderId]);

    const handleSelectProvider = (id: string) => {
      setSelectedProviderId(id);
      const prov = aiProviderStore.providers.find(p => p.id === id);
      if (prov) {
        setApiKey(prov.apiKey || '');
        setBaseUrl(prov.baseUrl || '');
        setActiveModel(prov.activeModel || prov.models[0] || '');
      }
    };

    const handleSave = async () => {
      if (!selectedProviderId) return;
      setIsSaving(true);
      try {
        const modelToSave = customModel.trim() || activeModel;
        await aiProviderStore.setApiKey(selectedProviderId, apiKey.trim());
        if (baseUrl.trim()) {
          aiProviderStore.setBaseUrl(selectedProviderId, baseUrl.trim());
        }
        if (modelToSave) {
          aiProviderStore.setActiveModel(selectedProviderId, modelToSave);
        }
        setSnackbarMsg(`Saved API settings for ${activeProvider?.name}`);
        setTimeout(() => {
          onDismiss();
        }, 600);
      } catch (err: any) {
        setSnackbarMsg('Failed to save API key: ' + (err?.message || 'Unknown error'));
      } finally {
        setIsSaving(false);
      }
    };

    const handleClear = async () => {
      if (!selectedProviderId) return;
      try {
        await aiProviderStore.clearApiKey(selectedProviderId);
        setApiKey('');
        setSnackbarMsg(`Cleared API key for ${activeProvider?.name}`);
      } catch (err) {
        setSnackbarMsg('Failed to clear key');
      }
    };

    const isConfigured = Boolean(activeProvider?.apiKey);

    return (
      <Sheet
        isVisible={isVisible}
        onClose={onDismiss}
        title="AI Cloud Providers & API Keys"
        snapPoints={['80%']}>
        <Sheet.ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.description}>
            Configure external AI providers for high-speed cloud inference, fallback when
            no local model is loaded, or accessing larger models.
          </Text>

          <Text style={styles.label}>Select Provider</Text>
          <View style={styles.providerSelectorRow}>
            {aiProviderStore.providers.map(provider => {
              const isSelected = provider.id === selectedProviderId;
              const hasKey = Boolean(provider.apiKey);
              return (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerChip,
                    isSelected && styles.providerChipActive,
                  ]}
                  onPress={() => handleSelectProvider(provider.id)}>
                  <Text
                    style={[
                      styles.providerChipText,
                      isSelected && styles.providerChipTextActive,
                    ]}>
                    {provider.name} {hasKey ? '✓' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeProvider && (
            <View style={styles.inputSection}>
              <Text
                style={[
                  styles.statusBadge,
                  isConfigured ? styles.statusConfigured : styles.statusNotConfigured,
                ]}>
                {isConfigured ? '✓ Configured & Active' : '● Not Configured'}
              </Text>

              <TextInput
                label={`${activeProvider.name} API Key`}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="sk-..."
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                secureTextEntry={secureTextEntry}
                right={
                  <PaperTextInput.Icon
                    icon={({color}) =>
                      secureTextEntry ? (
                        <EyeIcon width={24} height={24} stroke={color} />
                      ) : (
                        <EyeOffIcon width={24} height={24} stroke={color} />
                      )
                    }
                    onPress={() => setSecureTextEntry(prev => !prev)}
                  />
                }
              />

              {activeProvider.id === 'custom' && (
                <TextInput
                  label="Custom Base URL"
                  value={baseUrl}
                  onChangeText={setBaseUrl}
                  placeholder="https://api.example.com/v1"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}

              <Text style={styles.label}>Select or Enter Model</Text>
              <View style={styles.modelSelectContainer}>
                {activeProvider.models.map(model => {
                  const isModelActive = activeModel === model && !customModel;
                  return (
                    <TouchableOpacity
                      key={model}
                      style={[
                        styles.modelChip,
                        isModelActive && styles.modelChipActive,
                      ]}
                      onPress={() => {
                        setActiveModel(model);
                        setCustomModel('');
                      }}>
                      <Text
                        style={[
                          styles.modelChipText,
                          isModelActive && styles.modelChipTextActive,
                        ]}>
                        {model}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                label="Custom Model Name (Optional override)"
                value={customModel}
                onChangeText={setCustomModel}
                placeholder="e.g. gpt-4o, claude-3-5-sonnet, etc."
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}
        </Sheet.ScrollView>

        <Sheet.Actions>
          <View style={styles.buttonsContainer}>
            {isConfigured && (
              <Button
                mode="text"
                onPress={handleClear}
                style={styles.clearButton}
                textColor={theme.colors.error}>
                Clear Key
              </Button>
            )}
            <Button
              mode="contained"
              onPress={handleSave}
              loading={isSaving}
              disabled={isSaving || !apiKey.trim()}
              style={styles.saveButton}>
              Save & Activate
            </Button>
          </View>
        </Sheet.Actions>

        <Snackbar
          visible={Boolean(snackbarMsg)}
          onDismiss={() => setSnackbarMsg(null)}
          duration={2500}
          style={styles.errorSnackbar}>
          {snackbarMsg || ''}
        </Snackbar>
      </Sheet>
    );
  },
);
