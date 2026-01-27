import * as React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  NavigationContainer,
  type NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { PeekPreview } from 'peekie';

enableScreens(true);

type RootStackParamList = {
  Home: undefined;
  Detail: { id: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type Item = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
};

const ITEMS: Item[] = Array.from({ length: 30 }).map((_, index) => {
  const id = String(index + 1);
  return {
    id,
    title: `Row ${id}`,
    subtitle: 'Press and hold to peek, press deeper to open',
    body:
      'This is preview content. It should be scrollable inside the peek ' +
      'surface so you can validate gesture handling and layout sizing.',
  };
});

function HomeScreen() {
  const { width } = useWindowDimensions();
  const horizontalPadding = 16;
  const previewWidth = Math.max(280, width - horizontalPadding * 2);
  const previewHeight = 360;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>peekie</Text>
        <Text style={styles.headerSubtitle}>Peek, scroll, then commit</Text>
      </View>

      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PeekRow item={item} previewWidth={previewWidth} previewHeight={previewHeight} />
        )}
      />
    </SafeAreaView>
  );
}

function DetailScreen({ route }: NativeStackScreenProps<RootStackParamList, 'Detail'>) {
  const { id, title } = route.params;
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.detailCard}>
        <Text style={styles.detailEyebrow}>Detail screen</Text>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailBody}>
          You committed row {id}. This validates that peek -> pop integrates cleanly with
          React Navigation.
        </Text>
      </View>
    </SafeAreaView>
  );
}

type PeekRowProps = {
  item: Item;
  previewWidth: number;
  previewHeight: number;
};

function PeekRow({ item, previewWidth, previewHeight }: PeekRowProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const preferredContentSize = React.useMemo(
    () => ({ width: previewWidth, height: previewHeight }),
    [previewHeight, previewWidth]
  );

  return (
    <PeekPreview
      previewKey={item.id}
      onCommit={() => navigation.navigate('Detail', { id: item.id, title: item.title })}
      preferredContentSize={preferredContentSize}
      style={styles.peekContainer}
    >
      <PeekPreview.Trigger>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
        </View>
      </PeekPreview.Trigger>

      <PeekPreview.Preview preferredContentSize={preferredContentSize}>
        <PreviewCard item={item} previewWidth={previewWidth} />
      </PeekPreview.Preview>
    </PeekPreview>
  );
}

type PreviewCardProps = {
  item: Item;
  previewWidth: number;
};

function PreviewCard({ item, previewWidth }: PreviewCardProps) {
  return (
    <View style={[styles.previewCard, { width: previewWidth }]}>
      <ScrollView
        style={styles.previewScroll}
        contentContainerStyle={styles.previewScrollContent}
        showsVerticalScrollIndicator
      >
        <Text style={styles.previewEyebrow}>Preview</Text>
        <Text style={styles.previewTitle}>{item.title}</Text>
        <Text style={styles.previewBody}>{item.body}</Text>

        <View style={styles.previewSection}>
          <Text style={styles.previewSectionTitle}>Why this screen exists</Text>
          <Text style={styles.previewBody}>
            1. Ensure the preview matches the row width.
          </Text>
          <Text style={styles.previewBody}>
            2. Confirm that scrolling works inside the preview.
          </Text>
          <Text style={styles.previewBody}>
            3. Validate that commit navigates to a detail screen.
          </Text>
        </View>

        <View style={styles.previewSection}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Text key={index} style={styles.previewBody}>
              Extra content line {index + 1} — keep scrolling.
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detail' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0b0b0c',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  peekContainer: {
    borderRadius: 16,
  },
  row: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#27272a',
    gap: 6,
  },
  rowTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  rowSubtitle: {
    color: '#a1a1aa',
    fontSize: 13,
  },
  previewCard: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#111113',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2e',
  },
  previewScroll: {
    flex: 1,
  },
  previewScrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 12,
  },
  previewEyebrow: {
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  previewTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },
  previewBody: {
    color: '#e4e4e7',
    fontSize: 15,
    lineHeight: 21,
  },
  previewSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2e',
    gap: 6,
  },
  previewSectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  detailCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    gap: 8,
  },
  detailEyebrow: {
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  detailTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: '800',
  },
  detailBody: {
    color: '#e4e4e7',
    fontSize: 16,
    lineHeight: 22,
  },
});
