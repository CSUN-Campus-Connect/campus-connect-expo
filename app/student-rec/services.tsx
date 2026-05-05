import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ServiceModuleRN } from '@/studentRec/components/ServiceModuleRN';
import { ServicesHeroRN } from '@/studentRec/components/ServicesHeroRN';
import { ServicesSearchRN } from '@/studentRec/components/ServicesSearchRN';
import { SrcHeader } from '@/studentRec/components/SrcHeader';
import { SERVICES } from '@/studentRec/data/servicesData';

export default function StudentRecServicesRoute() {
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return SERVICES;
    return SERVICES.filter((s) =>
      [
        s.title,
        s.tagline,
        s.description,
        ...(s.bullets ?? []),
        ...(s.rentalItems?.map((r) => r.name) ?? []),
        ...(s.trainers?.flatMap((t) => [t.name, t.role, ...t.specialties]) ?? []),
        ...(s.spaces?.flatMap((sp) => [sp.name, ...sp.activities, ...sp.features]) ?? []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [q]);

  return (
    <View style={{ flex: 1 }}>
      <SrcHeader />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <ServicesHeroRN />
        <ServicesSearchRN search={search} onChange={setSearch} resultCount={filtered.length} />
        {filtered.map((svc) => (
          <View key={svc.id} collapsable={false}>
            <ServiceModuleRN service={svc} />
          </View>
        ))}
        {filtered.length === 0 ? (
          <Text style={{ color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 40, fontSize: 15 }}>
            No services match your search.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
