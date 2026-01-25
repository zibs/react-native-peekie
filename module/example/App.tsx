import * as React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { PeekPreview } from 'peekie';

export default function App() {
  const [committed, setCommitted] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Peek & Pop Demo</Text>

      <PeekPreview
        previewKey="demo-preview"
        onCommit={() => setCommitted(true)}
        onDismiss={() => setCommitted(false)}
        style={styles.trigger}
      >
        <PeekPreview.Trigger>
          <Text style={styles.triggerText}>Press and hold me</Text>
        </PeekPreview.Trigger>
        <PeekPreview.Preview preferredContentSize={{ width: 0, height: 220 }}>
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Peek Preview</Text>
            <Text>Release to dismiss. Press deeper to commit.</Text>
          </View>
        </PeekPreview.Preview>
      </PeekPreview>

      <Text style={styles.status}>
        {committed ? 'Committed ✅' : 'Not committed yet'}
      </Text>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    fontSize: 28,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
  trigger: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    marginTop: 12,
  },
  triggerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  status: {
    marginTop: 16,
    textAlign: 'center' as const,
    fontSize: 16,
  },
  preview: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
};
