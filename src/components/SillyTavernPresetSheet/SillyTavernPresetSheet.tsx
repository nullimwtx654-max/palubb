import React, {useState} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import {Text, Button, Switch} from 'react-native-paper';
import {observer} from 'mobx-react';

import {Sheet, TextInput, InputSlider} from '..';
import {useTheme} from '../../hooks';
import {sillyTavernPresetStore} from '../../store';
import {pickJsonFile} from '../../utils/importUtils';
import {createStyles} from './styles';

interface SillyTavernPresetSheetProps {
  isVisible: boolean;
  onDismiss: () => void;
}

type TabKey = 'presets' | 'prompts' | 'samplers' | 'utility';

export const SillyTavernPresetSheet: React.FC<SillyTavernPresetSheetProps> = observer(
  ({isVisible, onDismiss}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [activeTab, setActiveTab] = useState<TabKey>('presets');
    const activePreset = sillyTavernPresetStore.activePreset;

    const handleImportPreset = async () => {
      try {
        const fileContent = await pickJsonFile();
        if (!fileContent) {
          return;
        }
        const parsed = JSON.parse(fileContent);
        const preset = await sillyTavernPresetStore.importPreset(parsed);
        Alert.alert('Imported Preset', `Successfully imported "${preset.name}".`);
      } catch (err: any) {
        Alert.alert('Import Failed', err?.message || 'Could not parse preset JSON.');
      }
    };

    const handleExportPreset = async () => {
      try {
        if (!activePreset) {
          return;
        }
        await sillyTavernPresetStore.exportPresetToFile(activePreset.id);
      } catch (err: any) {
        Alert.alert('Export Failed', err?.message || 'Could not export preset.');
      }
    };

    const handleSamplerChange = (key: string, value: number) => {
      if (!activePreset) {
        return;
      }
      sillyTavernPresetStore.updateSampler(activePreset.id, {
        [key]: value,
      } as any);
    };

    const orderEntries = activePreset?.prompt_order?.[0]?.order || [];

    return (
      <Sheet
        isVisible={isVisible}
        onClose={onDismiss}
        title="SillyTavern Preset & Prompt Manager"
        snapPoints={['85%']}>
        {/* Navigation Tabs */}
        <View style={{paddingHorizontal: 16, paddingTop: 8}}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'presets' && styles.tabButtonActive]}
              onPress={() => setActiveTab('presets')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'presets' && styles.tabButtonTextActive,
                ]}>
                Presets
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'prompts' && styles.tabButtonActive]}
              onPress={() => setActiveTab('prompts')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'prompts' && styles.tabButtonTextActive,
                ]}>
                Prompts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'samplers' && styles.tabButtonActive]}
              onPress={() => setActiveTab('samplers')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'samplers' && styles.tabButtonTextActive,
                ]}>
                Samplers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'utility' && styles.tabButtonActive]}
              onPress={() => setActiveTab('utility')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'utility' && styles.tabButtonTextActive,
                ]}>
                Macros & Utility
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Sheet.ScrollView contentContainerStyle={styles.container}>
          {activeTab === 'presets' && (
            <View>
              <Text style={styles.description}>
                {
                  'Select or import SillyTavern presets to configure advanced prompt ordering, Experimental Macro Engine ({{char}}, {{user}}, nested macros, conditionals, math), author notes, and samplers.'
                }
              </Text>

              <View style={styles.actionRow}>
                <Button
                  mode="contained-tonal"
                  onPress={handleImportPreset}
                  style={styles.actionButton}>
                  Import Preset JSON
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleExportPreset}
                  style={styles.actionButton}>
                  Export Active Preset
                </Button>
              </View>

              <Text style={styles.sectionTitle}>Available Presets</Text>
              {sillyTavernPresetStore.presets.map(preset => {
                const isActive = preset.id === sillyTavernPresetStore.activePresetId;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[styles.presetCard, isActive && styles.presetCardActive]}
                    onPress={() => sillyTavernPresetStore.setActivePreset(preset.id)}>
                    <View style={{flex: 1}}>
                      <Text style={styles.presetName}>
                        {preset.name} {isActive ? '✓ (Active)' : ''}
                      </Text>
                      {preset.description ? (
                        <Text style={styles.presetDesc}>{preset.description}</Text>
                      ) : null}
                    </View>
                    {!preset.isBuiltin && (
                      <Button
                        mode="text"
                        textColor={theme.colors.error}
                        onPress={() => sillyTavernPresetStore.deletePreset(preset.id)}>
                        Delete
                      </Button>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'prompts' && (
            <View>
              <Text style={styles.description}>
                Prompt Manager defines the exact order and system prompts injected into the context window.
              </Text>
              <Text style={styles.sectionTitle}>
                Prompt Order ({activePreset?.prompts?.length || 0} entries)
              </Text>
              {activePreset?.prompts?.map((prompt, idx) => {
                const isEnabled =
                  orderEntries.find(p => p.identifier === prompt.identifier)?.enabled ??
                  prompt.enabled ??
                  true;
                return (
                  <View key={prompt.identifier || idx} style={styles.promptItem}>
                    <View style={styles.promptItemHeader}>
                      <View style={{flex: 1}}>
                        <Text style={styles.promptItemName}>{prompt.name}</Text>
                        <Text style={styles.promptItemRole}>
                          {prompt.role || 'system'} • Marker: {prompt.marker ? 'Yes' : 'No'}
                        </Text>
                      </View>
                      <Switch
                        value={Boolean(isEnabled)}
                        onValueChange={enabled =>
                          sillyTavernPresetStore.togglePrompt(
                            activePreset.id,
                            prompt.identifier,
                            enabled,
                          )
                        }
                      />
                    </View>
                    {prompt.content ? (
                      <Text style={styles.promptItemContent} numberOfLines={3}>
                        {prompt.content}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}

          {activeTab === 'samplers' && (
            <View>
              <Text style={styles.description}>
                Fine-tune generation parameters matching SillyTavern presets.
              </Text>

              <View style={styles.sliderRow}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Temperature</Text>
                  <Text style={styles.sliderValue}>
                    {(activePreset?.temperature ?? 1.0).toFixed(2)}
                  </Text>
                </View>
                <InputSlider
                  value={activePreset?.temperature ?? 1.0}
                  onValueChange={val => handleSamplerChange('temperature', val)}
                  minimumValue={0.0}
                  maximumValue={2.0}
                  step={0.05}
                />
              </View>

              <View style={styles.sliderRow}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Top P</Text>
                  <Text style={styles.sliderValue}>
                    {(activePreset?.top_p ?? 0.95).toFixed(2)}
                  </Text>
                </View>
                <InputSlider
                  value={activePreset?.top_p ?? 0.95}
                  onValueChange={val => handleSamplerChange('top_p', val)}
                  minimumValue={0.0}
                  maximumValue={1.0}
                  step={0.01}
                />
              </View>

              <View style={styles.sliderRow}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Min P</Text>
                  <Text style={styles.sliderValue}>
                    {(activePreset?.min_p ?? 0.05).toFixed(2)}
                  </Text>
                </View>
                <InputSlider
                  value={activePreset?.min_p ?? 0.05}
                  onValueChange={val => handleSamplerChange('min_p', val)}
                  minimumValue={0.0}
                  maximumValue={1.0}
                  step={0.01}
                />
              </View>

              <View style={styles.sliderRow}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Repetition Penalty</Text>
                  <Text style={styles.sliderValue}>
                    {(activePreset?.repetition_penalty ?? 1.1).toFixed(2)}
                  </Text>
                </View>
                <InputSlider
                  value={activePreset?.repetition_penalty ?? 1.1}
                  onValueChange={val => handleSamplerChange('repetition_penalty', val)}
                  minimumValue={1.0}
                  maximumValue={2.0}
                  step={0.02}
                />
              </View>
            </View>
          )}

          {activeTab === 'utility' && (
            <View style={{gap: 12}}>
              <View style={styles.promptItem}>
                <View style={styles.promptItemHeader}>
                  <View style={{flex: 1, paddingRight: 12}}>
                    <Text style={styles.promptItemName}>
                      Experimental Macro Engine
                    </Text>
                    <Text style={styles.promptItemContent}>
                      {
                        'Enable inside-out nested macro recursion, conditionals ({{if}}, {{#if}}), math/calc ({{calc}}, {{add}}), global vars, and pipe filters ({{char | uppercase}}).'
                      }
                    </Text>
                  </View>
                  <Switch
                    value={sillyTavernPresetStore.experimentalMacroEngine}
                    onValueChange={val =>
                      sillyTavernPresetStore.setExperimentalMacroEngine(val)
                    }
                  />
                </View>
              </View>

              <Text style={styles.description}>
                Configure User Persona, in-chat Author Notes, and system nudges.
              </Text>
              <TextInput
                label="User Name ({{user}})"
                value={sillyTavernPresetStore.userName}
                onChangeText={val => sillyTavernPresetStore.setUserName(val)}
                placeholder="User"
              />
              <TextInput
                label="User Persona ({{persona}})"
                value={sillyTavernPresetStore.userPersona}
                onChangeText={val => sillyTavernPresetStore.setUserPersona(val)}
                placeholder="Describe your character or persona..."
                multiline
                numberOfLines={2}
              />
              <TextInput
                label="Author's Note"
                value={activePreset?.authors_note || ''}
                onChangeText={val =>
                  activePreset &&
                  sillyTavernPresetStore.updateUtility(activePreset.id, {authors_note: val})
                }
                placeholder="e.g. Write vividly with focus on dialogue and emotions."
                multiline
                numberOfLines={3}
              />
              <TextInput
                label="Continue Nudge Prompt"
                value={activePreset?.continue_nudge_prompt || ''}
                onChangeText={val =>
                  activePreset &&
                  sillyTavernPresetStore.updateUtility(activePreset.id, {
                    continue_nudge_prompt: val,
                  })
                }
                placeholder="Continue your response naturally..."
              />
              <TextInput
                label="Impersonation Prompt"
                value={activePreset?.impersonation_prompt || ''}
                onChangeText={val =>
                  activePreset &&
                  sillyTavernPresetStore.updateUtility(activePreset.id, {
                    impersonation_prompt: val,
                  })
                }
                placeholder="Write the next response as {{user}}..."
              />
            </View>
          )}
        </Sheet.ScrollView>

        <Sheet.Actions>
          <View style={styles.footerActions}>
            <Button mode="contained" onPress={onDismiss}>
              Done
            </Button>
          </View>
        </Sheet.Actions>
      </Sheet>
    );
  },
);
