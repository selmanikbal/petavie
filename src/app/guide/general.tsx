import { StackScreen } from '@/components/ui/stack-screen';
import { GeneralGuideDetail } from '@/features/guide/components/general-guide-detail';
import { getGuideMeta, listGeneralCareTips, listGeneralFaqs } from '@/features/guide/service';

export default function GeneralGuideScreen() {
  const meta = getGuideMeta();

  return (
    <StackScreen title="Genel bilgiler" scrollable>
      <GeneralGuideDetail
        careTips={listGeneralCareTips()}
        faqs={listGeneralFaqs()}
        disclaimer={meta.disclaimer}
      />
    </StackScreen>
  );
}
