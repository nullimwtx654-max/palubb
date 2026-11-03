import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import {Text, Button, Switch, IconButton} from 'react-native-paper';
import {observer} from 'mobx-react';

import {Sheet, TextInput} from '..';
import {useTheme} from '../../hooks';
import {
  chatPersonalizationStore,
  chatMemoryStore,
  ChatTone,
  POCKETPAL_DEFAULT_SYSTEM_PROMPT,
} from '../../store';
import {getRecentChatsSummaries, ChatSummaryItem} from '../../services/chatLookupService';
import {createStyles} from './styles';

interface ChatPersonalizationSheetProps {
  isVisible: boolean;
  onDismiss: () => void;
}

type TabKey = 'behavior' | 'advanced' | 'memory' | 'lookup';

export const ChatPersonalizationSheet: React.FC<ChatPersonalizationSheetProps> =
  observer(({isVisible, onDismiss}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [activeTab, setActiveTab] = useState<TabKey>('behavior');
    const [newMemoryText, setNewMemoryText] = useState('');
    const [recentSummaries, setRecentSummaries] = useState<ChatSummaryItem[]>([]);
    const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);

    useEffect(() => {
      if (isVisible && activeTab === 'lookup') {
        loadSummaries();
      }
    }, [isVisible, activeTab]);

    const loadSummaries = async () => {
      setIsLoadingSummaries(true);
      try {
        const items = await getRecentChatsSummaries(
          chatPersonalizationStore.chatLookupCount || 35,
        );
        setRecentSummaries(items);
      } finally {
        setIsLoadingSummaries(false);
      }
    };

    const handleAddMemory = () => {
      if (!newMemoryText.trim()) return;
      try {
        chatMemoryStore.addMemory(newMemoryText.trim(), 'user');
        setNewMemoryText('');
      } catch (err: any) {
        Alert.alert('Memory Error', err?.message || 'Could not save memory');
      }
    };

    const handleDeleteMemory = (id: string) => {
      chatMemoryStore.deleteMemory(id);
    };

    const tones: Array<{key: ChatTone; label: string}> = [
      {key: 'friendly', label: 'Friendly & Peer'},
      {key: 'concise', label: 'Concise & Direct'},
      {key: 'creative', label: 'Creative & Vivid'},
      {key: 'analytical', label: 'Analytical & Rigorous'},
      {key: 'humorous', label: 'Humorous & Playful'},
    ];

    return (
      <Sheet
        isVisible={isVisible}
        onClose={onDismiss}
        title="Chat Personalization & Memory"
        snapPoints={['85%']}>
        {/* Navigation Tabs */}
        <View style={{paddingHorizontal: 16, paddingTop: 8}}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'behavior' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('behavior')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'behavior' && styles.tabButtonTextActive,
                ]}>
                Tones & Style
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'advanced' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('advanced')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'advanced' && styles.tabButtonTextActive,
                ]}>
                Advanced
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'memory' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('memory')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'memory' && styles.tabButtonTextActive,
                ]}>
                Memory ({chatMemoryStore.memories.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'lookup' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('lookup')}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'lookup' && styles.tabButtonTextActive,
                ]}>
                Chat Lookup
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Sheet.ScrollView contentContainerStyle={styles.container}>
          {activeTab === 'behavior' && (
            <View>
              <Text style={styles.description}>
                Configure how PocketPal behaves and responds in normal chats.
                These settings strictly apply to chat and never interfere with PalsHub.
              </Text>

              <Text style={styles.sectionTitle}>Response Tone</Text>
              <View style={styles.toneGrid}>
                {tones.map(t => {
                  const isSelected = chatPersonalizationStore.tone === t.key;
                  return (
                    <TouchableOpacity
                      key={t.key}
                      style={[
                        styles.toneChip,
                        isSelected && styles.toneChipActive,
                      ]}
                      onPress={() => chatPersonalizationStore.setTone(t.key)}>
                      <Text
                        style={[
                          styles.toneChipText,
                          isSelected && styles.toneChipTextActive,
                        ]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.sectionTitle, {marginTop: 12}]}>
                Behavioral Toggles
              </Text>

              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>Markdown Formatting</Text>
                  <Text style={styles.switchDesc}>
                    Use rich formatting, headings, bullet lists, and code blocks.
                  </Text>
                </View>
                <Switch
                  value={chatPersonalizationStore.useMarkdown}
                  onValueChange={val =>
                    chatPersonalizationStore.setUseMarkdown(val)
                  }
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>Step-by-Step Reasoning</Text>
                  <Text style={styles.switchDesc}>
                    Encourage the model to think through complex problems methodically.
                  </Text>
                </View>
                <Switch
                  value={chatPersonalizationStore.enableReasoning}
                  onValueChange={val =>
                    chatPersonalizationStore.setEnableReasoning(val)
                  }
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>Match User Language</Text>
                  <Text style={styles.switchDesc}>
                    Automatically respond in the same language as your prompt.
                  </Text>
                </View>
                <Switch
                  value={chatPersonalizationStore.matchUserLanguage}
                  onValueChange={val =>
                    chatPersonalizationStore.setMatchUserLanguage(val)
                  }
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>Concise Answers</Text>
                  <Text style={styles.switchDesc}>
                    Prioritize brief, scannable answers without unnecessary exposition.
                  </Text>
                </View>
                <Switch
                  value={chatPersonalizationStore.conciseAnswers}
                  onValueChange={val =>
                    chatPersonalizationStore.setConciseAnswers(val)
                  }
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>Suggest Follow-Ups</Text>
                  <Text style={styles.switchDesc}>
                    Provide 2-3 logical next questions or suggestions at the end.
                  </Text>
                </View>
                <Switch
                  value={chatPersonalizationStore.suggestFollowups}
                  onValueChange={val =>
                    chatPersonalizationStore.setSuggestFollowups(val)
                  }
                />
              </View>
            </View>
          )}

          {activeTab === 'advanced' && (
            <View style={{gap: 12}}>
              <Text style={styles.description}>
                Provide custom instructions or modify the PocketPal identity prompt.
                Write anything you want the AI to do or know about you.
              </Text>

              <Text style={styles.sectionTitle}>Custom Instructions</Text>
              <TextInput
                label="What should the AI know about you or how it should behave?"
                value={chatPersonalizationStore.customInstructions}
                onChangeText={val =>
                  chatPersonalizationStore.setCustomInstructions(val)
                }
                placeholder="e.g. I am a software engineer building mobile apps. Always explain code with types and concise comments."
                multiline
                numberOfLines={4}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Text style={styles.sectionTitle}>
                  PocketPal System Prompt
                </Text>
                <Button
                  mode="text"
                  onPress={() =>
                    chatPersonalizationStore.resetBaseSystemPrompt()
                  }>
                  Reset Default
                </Button>
              </View>
              <TextInput
                label="Base System Prompt"
                value={chatPersonalizationStore.baseSystemPrompt}
                onChangeText={val =>
                  chatPersonalizationStore.setBaseSystemPrompt(val)
                }
                placeholder={POCKETPAL_DEFAULT_SYSTEM_PROMPT}
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          {activeTab === 'memory' && (
            <View>
              <Text style={styles.description}>
                Long-term memory for normal chat. The AI uses an embedding model
                to retrieve relevant memories via cosine similarity. Both you and
                the AI can write new memories.
              </Text>

              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>AI Auto-Memory</Text>
                  <Text style={styles.switchDesc}>
                    Allow PocketPal to automatically remember facts you share.
                  </Text>
                </View>
                <Switch
                  value={chatMemoryStore.isAutoMemoryEnabled}
                  onValueChange={val =>
                    chatMemoryStore.setAutoMemoryEnabled(val)
                  }
                />
              </View>

              <Text style={[styles.sectionTitle, {marginTop: 12}]}>
                Add Memory Fact
              </Text>
              <View style={styles.addMemoryRow}>
                <View style={{flex: 1}}>
                  <TextInput
                    value={newMemoryText}
                    onChangeText={setNewMemoryText}
                    placeholder="e.g. My favorite programming language is TypeScript"
                  />
                </View>
                <Button
                  mode="contained"
                  onPress={handleAddMemory}
                  disabled={!newMemoryText.trim()}>
                  Add
                </Button>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                  marginBottom: 8,
                }}>
                <Text style={styles.sectionTitle}>
                  Stored Memories ({chatMemoryStore.memories.length})
                </Text>
                {chatMemoryStore.memories.length > 0 && (
                  <Button
                    mode="text"
                    textColor={theme.colors.error}
                    onPress={() =>
                      Alert.alert(
                        'Clear Memories',
                        'Are you sure you want to delete all stored chat memories?',
                        [
                          {text: 'Cancel', style: 'cancel'},
                          {
                            text: 'Delete All',
                            style: 'destructive',
                            onPress: () => chatMemoryStore.clearMemories(),
                          },
                        ],
                      )
                    }>
                    Clear All
                  </Button>
                )}
              </View>

              {chatMemoryStore.memories.length === 0 ? (
                <Text
                  style={[
                    styles.description,
                    {fontStyle: 'italic', textAlign: 'center', marginVertical: 16},
                  ]}>
                  No memories stored yet. Add one above or tell PocketPal in chat!
                </Text>
              ) : (
                chatMemoryStore.memories.map(item => (
                  <View key={item.id} style={styles.memoryItem}>
                    <View style={{flex: 1, paddingRight: 8}}>
                      <Text style={styles.memoryText}>{item.content}</Text>
                      <Text style={styles.memoryMeta}>
                        Source: {item.source} •{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      iconColor={theme.colors.error}
                      onPress={() => handleDeleteMemory(item.id)}
                    />
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'lookup' && (
            <View>
              <Text style={styles.description}>
                Cross-Chat Awareness provides PocketPal with 1-paragraph summaries
                of your last 35 chats, allowing it to remember past topics, projects,
                and context. Strictly disabled in PalsHub.
              </Text>

              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>
                    Enable Cross-Chat Lookup
                  </Text>
                  <Text style={styles.switchDesc}>
                    Inject summaries of your last 35 chats into normal chat context.
                  </Text>
                </View>
                <Switch
                  value={chatPersonalizationStore.enableChatLookup}
                  onValueChange={val =>
                    chatPersonalizationStore.setEnableChatLookup(val)
                  }
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                  marginBottom: 8,
                }}>
                <Text style={styles.sectionTitle}>
                  Last 35 Chats Summaries ({recentSummaries.length})
                </Text>
                <Button
                  mode="text"
                  loading={isLoadingSummaries}
                  onPress={loadSummaries}>
                  Refresh
                </Button>
              </View>

              {recentSummaries.length === 0 ? (
                <Text
                  style={[
                    styles.description,
                    {fontStyle: 'italic', textAlign: 'center', marginVertical: 16},
                  ]}>
                  {isLoadingSummaries
                    ? 'Loading summaries...'
                    : 'No past normal chats found to summarize.'}
                </Text>
              ) : (
                recentSummaries.map((item, idx) => (
                  <View key={item.id} style={styles.chatSummaryCard}>
                    <View style={styles.chatSummaryHeader}>
                      <Text style={styles.chatSummaryTitle} numberOfLines={1}>
                        #{idx + 1}. {item.title}
                      </Text>
                      <Text style={styles.chatSummaryDate}>
                        {item.date ? item.date.substring(0, 10) : ''}
                      </Text>
                    </View>
                    <Text style={styles.chatSummaryBody}>{item.summary}</Text>
                  </View>
                ))
              )}
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
  });
