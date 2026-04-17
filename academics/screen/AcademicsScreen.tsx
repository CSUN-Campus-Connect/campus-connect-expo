import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AcademicsDueDates } from '@/academics/components/AcademicsDueDates';
import { AcademicsNav } from '@/academics/components/AcademicsNav';
import { AcademicsNoteShare } from '@/academics/components/AcademicsNoteShare';
import { AcademicsPlaceholderTab } from '@/academics/components/AcademicsPlaceholderTab';
import { AcademicsStudyGroups } from '@/academics/components/AcademicsStudyGroups';
import { AcademicsUniCart } from '@/academics/components/AcademicsUniCart';
import { CourseCard } from '@/academics/components/CourseCard';
import { CourseInfoModal } from '@/academics/components/CourseInfoModal';
import { AcademicsColors, academicsStyles } from '@/academics/academicsStyles';
import { useAcademicsData } from '@/academics/useAcademicsData';
import { BottomTabs } from '@/dashboard/components/BottomTabs';

export function AcademicsScreen() {
  const router = useRouter();
  const data = useAcademicsData();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterMode, setFilterMode] = React.useState<'all' | 'online' | 'inperson'>('all');
  const [semPickerOpen, setSemPickerOpen] = React.useState(false);

  const displayedCourses = React.useMemo(() => {
    let courses = data.filteredCourses ?? [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.subject?.toLowerCase().includes(q) ||
          c.number?.toLowerCase().includes(q) ||
          (c.title ?? '').toLowerCase().includes(q) ||
          (c.professor ?? '').toLowerCase().includes(q)
      );
    }
    if (filterMode === 'online') courses = courses.filter((c) => c.isOnline);
    if (filterMode === 'inperson') courses = courses.filter((c) => !c.isOnline);
    return courses;
  }, [data.filteredCourses, searchQuery, filterMode]);

  const cartIdSet = React.useMemo(() => new Set(data.cartClasses.map((c) => c.id)), [data.cartClasses]);

  React.useEffect(() => {
    if (!data.toast) return;
    const t = setTimeout(() => data.setToast(null), 2600);
    return () => clearTimeout(t);
  }, [data, data.toast]);

  if (!data.hydrated) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} edges={['top']}>
        <ActivityIndicator size="large" color={AcademicsColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={[...AcademicsColors.gradient]} style={academicsStyles.flex1}>
      <SafeAreaView style={academicsStyles.flex1} edges={['top']}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={academicsStyles.containerPad}
        >
          <View style={academicsStyles.topBarRow}>
            <Pressable onPress={() => router.push('/home')} style={academicsStyles.dashboardBtn}>
              <Ionicons name="arrow-back" size={15} color="rgba(255,255,255,0.88)" />
              <Text style={academicsStyles.dashboardBtnText}>Dashboard</Text>
            </Pressable>
            <AcademicsNav tab={data.tab} setTab={data.setTab} />
          </View>

          {data.tab === 0 ? (
            <>
              <View style={academicsStyles.glassPanel}>
                <View style={[academicsStyles.rowWrap, { marginBottom: 10 }]}>
                  <Pressable
                    onPress={() => setSemPickerOpen(true)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      minWidth: 160,
                    }}
                  >
                    <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>Semester</Text>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>{data.selectedSemesterId}</Text>
                    <Ionicons name="chevron-down" size={16} color="#fff" />
                  </Pressable>
                </View>

                <View style={academicsStyles.rowWrap}>
                  <View>
                    <Text style={academicsStyles.label}>Subject</Text>
                    <TextInput
                      value={data.addSubject}
                      onChangeText={data.setAddSubject}
                      placeholder="COMP"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      autoCapitalize="characters"
                      style={[academicsStyles.input, { width: 82 }]}
                    />
                  </View>
                  <View>
                    <Text style={academicsStyles.label}>Number</Text>
                    <TextInput
                      value={data.addNumber}
                      onChangeText={data.setAddNumber}
                      placeholder="333"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      style={[academicsStyles.input, { width: 82 }]}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 120 }}>
                    <Text style={academicsStyles.label}>Title (optional)</Text>
                    <TextInput
                      value={data.addTitle}
                      onChangeText={data.setAddTitle}
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      style={academicsStyles.input}
                    />
                  </View>
                </View>
                <View style={[academicsStyles.rowWrap, { marginTop: 10 }]}>
                  <View style={{ flex: 1, minWidth: 120 }}>
                    <Text style={academicsStyles.label}>Professor</Text>
                    <TextInput
                      value={data.addProfessor}
                      onChangeText={data.setAddProfessor}
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      style={academicsStyles.input}
                    />
                  </View>
                  <View>
                    <Text style={academicsStyles.label}>Units</Text>
                    <TextInput
                      value={data.addUnits}
                      onChangeText={data.setAddUnits}
                      keyboardType="numeric"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      style={[academicsStyles.input, { width: 66 }]}
                    />
                  </View>
                  <Pressable onPress={data.handleAddCourse} style={[academicsStyles.primaryBtn, { marginTop: 18 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="add" size={16} color="#fff" />
                      <Text style={academicsStyles.primaryBtnText}>Add</Text>
                    </View>
                  </Pressable>
                </View>

                <View style={[academicsStyles.rowWrap, { marginTop: 14 }]}>
                  <View style={{ flex: 1, minWidth: 130 }}>
                    <Text style={academicsStyles.label}>New Semester</Text>
                    <TextInput
                      value={data.newSemName}
                      onChangeText={data.setNewSemName}
                      placeholder="Fall 2026"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      style={academicsStyles.input}
                    />
                  </View>
                  <Pressable onPress={data.handleAddSemester} style={[academicsStyles.ghostBtn, { marginTop: 18 }]}>
                    <Text style={academicsStyles.ghostBtnText}>+ Semester</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{ marginBottom: 12, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="search" size={16} color="rgba(255,255,255,0.45)" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search courses, professors…"
                    placeholderTextColor="rgba(255,255,255,0.38)"
                    style={academicsStyles.searchInput}
                  />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                    {(['all', 'online', 'inperson'] as const).map((f) => (
                      <Pressable
                        key={f}
                        onPress={() => setFilterMode(f)}
                        style={[
                          academicsStyles.chip,
                          {
                            backgroundColor: filterMode === f ? '#fff' : 'rgba(255,255,255,0.12)',
                            borderColor: filterMode === f ? 'transparent' : 'rgba(255,255,255,0.15)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            academicsStyles.chipText,
                            { color: filterMode === f ? '#A80532' : 'rgba(255,255,255,0.70)' },
                          ]}
                        >
                          {f === 'all' ? 'All' : f === 'online' ? 'Online' : 'In-Person'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                    {displayedCourses.length} course{displayedCourses.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              {displayedCourses.length === 0 ? (
                <View style={academicsStyles.emptyCard}>
                  <Text style={{ color: 'rgba(255,255,255,0.88)', fontWeight: '800', marginBottom: 6, textAlign: 'center' }}>
                    {searchQuery ? 'No courses match your search.' : `No courses yet for ${data.selectedSemester?.id}.`}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.50)', fontSize: 13, textAlign: 'center' }}>
                    {searchQuery ? 'Try a different query.' : 'Add a course above (Subject + Number required).'}
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  {displayedCourses.map((c) => (
                    <CourseCard
                      key={c.id}
                      course={c}
                      onOpenInfo={() => data.openCourseModal(c.id, 1)}
                      onColorChange={(color) => data.setCourseColor(c.id, color)}
                    />
                  ))}
                </View>
              )}
            </>
          ) : null}

          {data.tab === 1 ? (
            <AcademicsDueDates
              assignments={data.upcomingAssignments}
              exams={data.upcomingExams}
              onToggleAssignment={data.toggleAssignment}
            />
          ) : null}

          {data.tab === 2 ? (
            <AcademicsUniCart
              semester={data.cartSemester}
              onSemesterChange={data.setCartSemester}
              semesters={data.semesters.map((s) => s.id)}
              search={data.classSearchQuery}
              onSearchChange={data.setClassSearchQuery}
              mode={data.cartModeFilter}
              onModeChange={data.setCartModeFilter}
              classes={data.filteredClassLibrary}
              cartIds={cartIdSet}
              onAdd={data.addToCart}
              onRemove={data.removeFromCart}
            />
          ) : null}

          {data.tab === 3 ? (
            <AcademicsStudyGroups groups={data.studyGroups} onJoin={data.joinStudyGroup} />
          ) : null}

          {data.tab === 4 ? <AcademicsNoteShare /> : null}

          {data.tab === 5 ? (
            <AcademicsPlaceholderTab
              title="Smart Planner"
              body="The full Smart Planner — schedule builder, conflict checks, and degree planning — is available on the Campus Connect website. This tab keeps your place in the Academic Hub; use UniCart, study groups, and Note Share here."
            />
          ) : null}
        </ScrollView>

        {data.toast ? (
          <View
            style={[
              academicsStyles.toast,
              {
                backgroundColor:
                  data.toast.type === 'success'
                    ? '#15803d'
                    : data.toast.type === 'warning'
                      ? '#b45309'
                      : data.toast.type === 'error'
                        ? '#b91c1c'
                        : '#1d4ed8',
              },
            ]}
          >
            <Text style={academicsStyles.toastText}>{data.toast.text}</Text>
          </View>
        ) : null}

        <CourseInfoModal
          open={data.modalOpen}
          onClose={() => data.setModalOpen(false)}
          semesterLabel={data.selectedSemester?.id ?? ''}
          course={data.activeCourse}
        />

        <Modal visible={semPickerOpen} transparent animationType="fade" onRequestClose={() => setSemPickerOpen(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setSemPickerOpen(false)}>
            <View style={{ marginTop: 120, marginHorizontal: 24 }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 12,
                  maxHeight: 360,
                }}
              >
                <Text style={{ fontWeight: '900', padding: 8, fontSize: 16 }}>Choose semester</Text>
                <ScrollView>
                  {data.semesters.map((s) => (
                    <Pressable
                      key={s.id}
                      onPress={() => {
                        data.setSelectedSemesterId(s.id);
                        setSemPickerOpen(false);
                      }}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        backgroundColor: s.id === data.selectedSemesterId ? 'rgba(168,5,50,0.12)' : 'transparent',
                      }}
                    >
                      <Text style={{ fontWeight: '700', fontSize: 16 }}>{s.id}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Pressable>
        </Modal>

        <BottomTabs />
      </SafeAreaView>
    </LinearGradient>
  );
}

export default AcademicsScreen;
