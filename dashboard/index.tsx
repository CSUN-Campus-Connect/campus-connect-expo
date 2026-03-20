import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabs, Header, MenuList, ProfileBar, SetupBanner } from './components';
import { dashboardStyles } from './styles';

export function DashboardScreen() {
  return (
    <SafeAreaView style={dashboardStyles.screen} edges={['top']}>
      <ScrollView
        style={dashboardStyles.screen}
        contentContainerStyle={[dashboardStyles.scrollContent, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header />
        <SetupBanner />
        <MenuList />
        <View style={dashboardStyles.emptyMiddle} />
        <ProfileBar />
      </ScrollView>
      <BottomTabs activeTab="home" />
    </SafeAreaView>
  );
}

export default DashboardScreen;
