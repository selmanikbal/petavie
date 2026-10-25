import { ScrollView, Pressable, Text } from 'react-native';

export type FilterChipOption = {
  id: string;
  label: string;
};

type FilterChipsProps = {
  options: FilterChipOption[];
  value: string;
  onChange: (id: string) => void;
};

/** DESIGN.md filter pills: inactive white+border; active soft tint + teal border/text. */
export function FilterChips({ options, value, onChange }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pb-1">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.id)}
            className={`rounded-full px-4 py-2 ${
              active
                ? 'border border-brand-500 bg-brand-100'
                : 'border border-surface-sunken bg-surface'
            }`}>
            <Text
              className={`text-sm ${
                active ? 'font-semibold text-brand-600' : 'font-medium text-ink-500'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
