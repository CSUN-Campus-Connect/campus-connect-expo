import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';

import { DashboardSidebar } from './DashboardSidebar';

type Props = {
  visible: boolean;
  onClose: () => void;
  drawerWidth: number;
};

/**
 * Slide-in panel from the left; campus nav lives here on narrow viewports.
 */
export function DashboardMobileDrawer({ visible, onClose, drawerWidth }: Props) {
  const slide = useRef(new Animated.Value(-drawerWidth)).current;
  const [modalShown, setModalShown] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalShown(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!modalShown) return;
    if (visible) {
      slide.setValue(-drawerWidth);
      Animated.timing(slide, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slide, {
        toValue: -drawerWidth,
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setModalShown(false);
      });
    }
  }, [visible, modalShown, drawerWidth, slide]);

  if (!modalShown) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root} accessibilityViewIsModal>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        />
        <Animated.View
          style={[
            styles.panel,
            {
              width: drawerWidth,
              transform: [{ translateX: slide }],
            },
          ]}
        >
          <DashboardSidebar
            variant="drawer"
            drawerWidth={drawerWidth}
            onAfterNavigate={onClose}
            onDrawerClose={onClose}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});
