import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { FilterChips } from '@/components/ui/filter-chips';
import { CARD_CLASS } from '@/components/ui/card';
import { StackScreen } from '@/components/ui/stack-screen';
import { useThemeColors } from '@/constants/theme';
import {
  openPrivacyPolicy,
  openStoreReview,
  sendFeedback,
  shareApp,
} from '@/features/settings/app-actions';
import {
  loadThemePreference,
  saveThemePreference,
  THEME_PREFERENCE_LABELS,
  type ThemePreference,
} from '@/features/settings/theme-preference';

const THEME_OPTIONS = (['system', 'light', 'dark'] as const).map((id) => ({
  id,
  label: THEME_PREFERENCE_LABELS[id],
}));

type RowProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  onPress: () => void;
};

function SettingsRow({ icon, title, subtitle, onPress }: RowProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      onPress={onPress}
      className="flex-row items-center gap-3 py-3 active:opacity-70">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-100">
        <Ionicons name={icon} size={18} color={colors.brand600} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-ink-900">{title}</Text>
        {subtitle ? <Text className="text-sm text-ink-500">{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.ink500} />
    </Pressable>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text className="mb-2 mt-6 text-sm font-semibold uppercase text-ink-500">{children}</Text>;
}

export default function SettingsScreen() {
  const colors = useThemeColors();
  const [theme, setTheme] = useState<ThemePreference>('system');

  useEffect(() => {
    void loadThemePreference().then(setTheme);
  }, []);

  function handleThemeChange(id: string) {
    const preference = id as ThemePreference;
    setTheme(preference);
    void saveThemePreference(preference);
  }

  return (
    <StackScreen title="Ayarlar" scrollable>
      <Text className="mb-2 text-sm font-semibold uppercase text-ink-500">Görünüm</Text>
      <FilterChips options={THEME_OPTIONS} value={theme} onChange={handleThemeChange} />

      <SectionTitle>Petavie</SectionTitle>
      <View className={`${CARD_CLASS} py-1`}>
        <SettingsRow
          icon="star"
          title="Uygulamayı değerlendir"
          subtitle="Mağazada puan ver, yorum yaz"
          onPress={() => void openStoreReview()}
        />
        <View className="h-px bg-surface-sunken" />
        <SettingsRow
          icon="share-social"
          title="Uygulamayı paylaş"
          subtitle="Arkadaşlarına Petavie'yi öner"
          onPress={() => void shareApp()}
        />
        <View className="h-px bg-surface-sunken" />
        <SettingsRow
          icon="mail"
          title="Geri bildirim gönder"
          subtitle="Öneri veya hata bildir"
          onPress={() => void sendFeedback()}
        />
      </View>

      <SectionTitle>Gizlilik</SectionTitle>
      <View className={`${CARD_CLASS} gap-1`}>
        <View className="flex-row items-start gap-3 pb-2">
          <Ionicons name="shield-checkmark" size={20} color={colors.brand600} />
          <Text className="flex-1 text-sm leading-5 text-ink-500">
            Petavie üyelik istemez. Dostlarının bilgileri, hatırlatmaların ve fotoğrafların yalnızca
            bu telefonda saklanır; hiçbir sunucuya gönderilmez.
          </Text>
        </View>
        <View className="h-px bg-surface-sunken" />
        <SettingsRow
          icon="document-text"
          title="Gizlilik politikası"
          onPress={() => void openPrivacyPolicy()}
        />
      </View>
    </StackScreen>
  );
}
