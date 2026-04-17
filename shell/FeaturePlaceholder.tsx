import React from 'react';
import { Text, View } from 'react-native';

import { featureScreenStyles as styles } from './featureScreenStyles';

export function FeaturePlaceholder({ body }: { body: string }) {
  return (
    <>
      <Text style={styles.body}>{body}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>More on the way</Text>
        <Text style={styles.cardBody}>
          We’re adding more tools here. Explore the rest of the app in the meantime.
        </Text>
      </View>
    </>
  );
}
