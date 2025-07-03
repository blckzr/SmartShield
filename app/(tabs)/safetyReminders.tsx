import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Configuration Constants for Easy Editing ---
const { width } = Dimensions.get('window');

// Color Palette
const COLORS = {
  primary: '#007bff',        // Blue for active elements/buttons
  secondary: '#6c757d',      // Grey for secondary text
  background: '#f8f8f8',     // Light background
  cardBackground: '#fff',    // White card backgrounds
  headerBackground: '#e9ecef', // Light grey for main accordion headers
  subheaderBackground: '#f1f3f5', // Even lighter grey for sub accordion headers
  textPrimary: '#333',       // Dark text
  textSecondary: '#555',     // Medium text
  textWarning: '#dc3545',    // Red for warnings/emergency
  dotInactive: '#ccc',       // Pagination dot inactive
  sunIcon: '#FFD700',        // Gold for sun icon
  alertIcon: '#dc3545',      // Red for alert icon
  headerText: '#2A397A',     // New color for specific headers
};

// Emergency Contact Numbers (Philippines)
const EMERGENCY_CONTACTS = {
  national: '911',
  redCross: '143',
  bureauOfFireProtection1: '(02) 426-0219',
  bureauOfFireProtection2: '(02) 426-3812',
};

// --- TypeScript Interfaces ---
interface CarouselItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ViewableItem {
  item: CarouselItem;
  key: string;
  index: number | null;
  isViewable: boolean;
}

interface ViewableItemsInfo {
  viewableItems: ViewableItem[];
  changed: ViewableItem[];
}

interface AccordionSubItemDetails {
  symptoms?: string[];
  firstAid?: string[];
  warning?: string;
  details?: string[];
}

interface AccordionSubItem {
  id: string;
  title: string;
  details: AccordionSubItemDetails;
}

interface AccordionItem {
  id: string;
  title: string;
  content: AccordionSubItem[];
}

// --- Data for Sections ---

// Data for Section 1: Tips During Heat Waves
const HEAT_WAVE_TIPS_DATA: CarouselItem[] = [
  {
    id: '1',
    title: 'Stay Indoors',
    description: `Stay in air-conditioned places as much as possible (home, library, mall).`,
    imageUrl: 'https://media.istockphoto.com/id/1217409043/photo/staying-home-during-covid-19-pandemic.jpg?s=612x612&w=0&k=20&c=WjM3z5_qr6axHrMsGJL6UQcS3dW-Z9XEDR4JkuR4UR8=',
  },
  {
    id: '2',
    title: 'Use Fans Wisely',
    description: `Fans help circulate air, but they don’t prevent heat-related illness above 90°F (32°C).`,
    imageUrl: 'https://pinoybuilders.ph/wp-content/uploads/2024/11/Knowledge-Builder-Be-a-Fan-of-Fans-Finding-the-Right-Ceiling-Fan-for-Proper-Room-Ventilation-at-Home.png',
  },
  {
    id: '3',
    title: 'Cool Showers',
    description: `Take cold showers or sponge baths to lower your body temperature.`,
    imageUrl: 'https://media.istockphoto.com/id/1295833267/photo/boy-with-blonde-hair-taking-shower-in-bath-with-water-indoor.jpg?s=612x612&w=0&k=20&c=YU2HWl8fwoysBJSH2tW5Bwyrq5yt43xZu4-YKljnNyo=',
  },
  {
    id: '4',
    title: 'Stay Hydrated',
    description: `Drink water frequently, even if you’re not thirsty. Avoid alcohol, caffeine, or sugary drinks — they dehydrate you.`,
    imageUrl: 'https://www.healthdigest.com/img/gallery/drinking-only-water-might-be-bad-for-you-heres-why/intro-1631039743.jpg',
  },
  {
    id: '5',
    title: 'Eat Hydrating Foods',
    description: `Watermelon, cucumbers, oranges, and leafy greens can help replenish fluids.`,
    imageUrl: 'https://static.toiimg.com/photo/90436529.cms',
  },
  {
    id: '6',
    title: 'Dress Smart',
    description: `Wear light-colored, loose clothing (cotton, breathable fabrics). Avoid dark colors.`,
    imageUrl: 'https://i.pinimg.com/originals/f5/e9/9b/f5e99b944b28fe2f043eaeacef9e4eee.jpg',
  },
  {
    id: '7',
    title: 'Limit Outdoor Activity',
    description: `Avoid strenuous work or exercise during the hottest parts of the day (usually 11 AM – 4 PM).`,
    imageUrl: 'https://s3.amazonaws.com/adaderanasinhala/1599009435-Heat-Stroke_L.jpg',
  },
  {
    id: '8',
    title: 'Use Sunscreen',
    description: `SPF 30 or higher. Sunburn affects your body’s ability to cool down.`,
    imageUrl: 'https://avimeeherbal.com/cdn/shop/articles/Apply_Sunscreen_After_Aloe_Vera_Gel_1.jpg?v=1706002157&width=2048',
  },
  {
    id: '9',
    title: 'Check Heat Index',
    description: `Both temperature and humidity affect heat stress. Look for "real feel" or "feels like" temperatures.`,
    imageUrl: 'https://img.freepik.com/premium-photo/woman-s-hand-working-laptop-office_35708-139.jpg',
  },
  {
    id: '10',
    title: 'Protect Vulnerable People',
    description: `Check on elderly neighbors, kids, and pets; they are more susceptible to heat-related illness.`,
    imageUrl: 'https://www.accessiblehomehealthcare.com/wp-content/uploads/word-image-62724-1.jpeg',
  },
  {
    id: '11',
    title: 'Never Leave Anyone in a Car',
    description: `Even with windows cracked, temperatures rise quickly and can be fatal.`,
    imageUrl: 'https://www.citizen-times.com/gcdn/presto/2020/07/10/PASH/d278225a-cfc8-4c15-962c-733eed024057-0820_WNCP_HotCars_01.JPG?width=660&height=442&fit=crop&format=pjpg&auto=webp',
  },
];

// Data for Section 2: Heat Emergencies (Dropdown/Accordion)
const HEAT_EMERGENCIES_DROPDOWN_DATA: AccordionItem[] = [
  {
    id: 'heatIllnessGuide',
    title: '🌡️ Heat Illness Guide',
    content: [
      {
        id: 'heatExhaustion',
        title: '🔸 Heat Exhaustion',
        details: {
          symptoms: [
            'Heavy sweating', 'Weakness or fatigue', 'Cold, pale, or clammy skin',
            'Dizziness or fainting', 'Nausea or vomiting', 'Headache',
            'Muscle cramps', 'Fast, weak pulse',
          ],
          firstAid: [
            'Move to a cooler area (air-conditioned room or shaded space).',
            'Loosen clothing and remove unnecessary layers.',
            'Apply cool, wet cloths to skin or take a cool bath.',
            'Sip water slowly. Avoid caffeine or alcohol.',
            'Rest. Avoid physical activity until fully recovered.',
          ],
          warning: '⚠️ If symptoms worsen or last longer than 1 hour, seek medical help.',
        },
      },
      {
        id: 'heatstroke',
        title: '🔺 Heatstroke (Medical Emergency)',
        details: {
          symptoms: [
            'Body temperature over 103°F (39.4°C)', 'Hot, red, dry, or damp skin',
            'Rapid, strong pulse', 'Confusion, slurred speech', 'Seizures',
            'Loss of consciousness',
          ],
          firstAid: [
            'Call 911 immediately.',
            'Move the person to a cooler location.',
            'Cool them quickly. Use cold water, ice packs (especially under armpits and groin), or wet cloths.',
            'Do NOT give fluids if the person is unconscious or confused.',
          ],
        },
      },
    ],
  },
  {
    id: 'preventionTips',
    title: '💧 Prevention Tips',
    content: [
      {
        id: 'stayingCool',
        title: '🧊 Staying Cool',
        details: {
          details: [
            'Stay in air-conditioned areas; if none available, visit public spaces like malls or libraries.',
            'Use fans with cold compresses or damp towels.',
            'Avoid direct sun between 11 AM – 4 PM.',
            'Take cool showers or sponge baths.',
          ],
        },
      },
      {
        id: 'hydrationStrategies',
        title: '🚰 Hydration Strategies',
        details: {
          details: [
            'Drink water frequently, not just when thirsty.',
            'Consume drinks with electrolytes if sweating heavily.',
            'Eat water-rich foods: cucumbers, watermelon, oranges, etc.',
            'Avoid dehydrating beverages like coffee, soda, or alcohol.',
          ],
        },
      },
      {
        id: 'appropriateClothing',
        title: '👕 Appropriate Clothing',
        details: {
          details: [
            'Wear lightweight, loose-fitting, light-colored clothing.',
            'Use wide-brimmed hats and UV-blocking sunglasses.',
            'Apply broad-spectrum sunscreen SPF 30+ every 2 hours outdoors.',
          ],
        },
      },
    ],
  },
  {
    id: 'vulnerablePopulations',
    title: '👶 Vulnerable Populations 👴',
    content: [
      {
        id: 'children',
        title: '🧒 Children',
        details: {
          details: [
            'Never leave a child in a parked car. Temperatures rise dangerously within minutes.',
            'Keep children indoors during peak heat.',
            'Dress them in breathable fabrics and ensure they drink fluids regularly.',
            'Watch for flushed skin, irritability, or lethargy. Those were early signs of overheating.',
          ],
        },
      },
      {
        id: 'olderAdults',
        title: '👵 Older Adults',
        details: {
          details: [
            'Elderly individuals may not feel heat or thirst as acutely.',
            'Encourage consistent fluid intake, even without thirst.',
            'Monitor for confusion or excessive fatigue. Those were potential heatstroke signs.',
            'Ensure their living space stays below 78°F (25.5°C) if possible.',
          ],
        },
      },
      {
        id: 'chronicIllness',
        title: '❤️‍🩹 People with Chronic Illness',
        details: {
          details: [
            'Certain medications (e.g., diuretics, beta-blockers) increase heat sensitivity.',
            'Those with heart disease, diabetes, or respiratory conditions must stay extra cool and hydrated.',
            'Talk with healthcare providers about heat-related medication risks.',
            'Have a support plan with family or caregivers in extreme heat conditions.',
          ],
        },
      },
    ],
  },
];


// --- Reusable Components ---

const CarouselCard: React.FC<{ item: CarouselItem }> = React.memo(({ item }) => (
  <View style={styles.carouselCard}>
    <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} />
    <Text style={styles.carouselTitle}>{item.title}</Text>
    <Text style={styles.carouselDescription}>{item.description}</Text>
  </View>
));

const PaginationDots: React.FC<{ data: CarouselItem[]; activeSlide: number }> = React.memo(({ data, activeSlide }) => (
  <View style={styles.paginationContainer}>
    {data.map((_, index) => (
      <View
        key={index}
        style={[
          styles.paginationDot,
          index === activeSlide ? styles.paginationDotActive : {},
        ]}
      />
    ))}
  </View>
));

interface AccordionSubItemProps {
  subItem: AccordionSubItem;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const AccordionSubItemComponent: React.FC<AccordionSubItemProps> = React.memo(({ subItem, isExpanded, onToggle }) => (
  <View style={styles.accordionSubItem}>
    <TouchableOpacity
      onPress={() => onToggle(subItem.id)}
      style={styles.accordionSubHeader}
    >
      <Text style={styles.accordionSubTitle}>{subItem.title}</Text>
      <Icon
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={20}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>

    {isExpanded && (
      <View style={styles.accordionSubContent}>
        {subItem.details.symptoms && (
          <>
            <Text style={styles.detailHeading}>Symptoms:</Text>
            {subItem.details.symptoms.map((symptom, idx) => (
              <Text key={idx} style={styles.detailText}>• {symptom}</Text>
            ))}
          </>
        )}
        {subItem.details.firstAid && (
          <>
            <Text style={styles.detailHeading}>First Aid Steps:</Text>
            {subItem.details.firstAid.map((step, idx) => (
              <Text key={idx} style={styles.detailText}>• {step}</Text>
            ))}
          </>
        )}
        {subItem.details.warning && (
          <Text style={styles.detailWarningText}>{subItem.details.warning}</Text>
        )}
        {subItem.details.details && (
          subItem.details.details.map((detail, idx) => (
            <Text key={idx} style={styles.detailText}>• {detail}</Text>
          ))
        )}
      </View>
    )}
  </View>
));

interface AccordionMainItemProps {
  section: AccordionItem;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  expandedSubSections: { [key: string]: boolean };
  onToggleSubSection: (id: string) => void;
}

const AccordionMainItemComponent: React.FC<AccordionMainItemProps> = React.memo(
  ({ section, isExpanded, onToggle, expandedSubSections, onToggleSubSection }) => (
    <View style={styles.accordionMainItem}>
      <TouchableOpacity
        onPress={() => onToggle(section.id)}
        style={styles.accordionMainHeader}
      >
        <Text style={styles.accordionMainTitle}>{section.title}</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.accordionMainContent}>
          {section.content.map((subItem: AccordionSubItem) => (
            <AccordionSubItemComponent
              key={subItem.id}
              subItem={subItem}
              isExpanded={expandedSubSections[subItem.id]}
              onToggle={onToggleSubSection}
            />
          ))}
        </View>
      )}
    </View>
  )
);


// --- Main Page Component ---
const SafetyTipsPage = () => {
  const [activeSlideHeatWaves, setActiveSlideHeatWaves] = useState<number>(0);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [expandedSubSections, setExpandedSubSections] = useState<{ [key: string]: boolean }>({});

  const onViewableItemsChangedHeatWaves = useRef((info: ViewableItemsInfo) => {
    if (info.viewableItems.length > 0) {
      setActiveSlideHeatWaves(info.viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleCallPress = useCallback((phoneNumber: string) => {
    // Remove non-numeric characters for linking to dialer
    Linking.openURL(`tel:${phoneNumber.replace(/[\s()-]/g, '')}`);
  }, []);

  const toggleMainSection = useCallback((id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
    setExpandedSubSections({}); // Optionally, close all sub-sections when a main section is toggled
  }, []);

  const toggleSubSection = useCallback((id: string) => {
    setExpandedSubSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Section 1: Tips During Heat Waves */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="weather-sunny" size={28} color={COLORS.sunIcon} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Tips During Heat Waves</Text>
          </View>
          <FlatList<CarouselItem>
            data={HEAT_WAVE_TIPS_DATA}
            renderItem={({ item }) => <CarouselCard item={item} />}
            keyExtractor={(item: CarouselItem) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChangedHeatWaves}
            viewabilityConfig={viewabilityConfig}
            contentContainerStyle={styles.carouselContentContainer}
          />
          <PaginationDots data={HEAT_WAVE_TIPS_DATA} activeSlide={activeSlideHeatWaves} />
        </View>

        {/* Section 2: Heat Emergencies (Dropdown/Accordion) */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="alert-octagon" size={28} color={COLORS.alertIcon} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Heat Emergencies</Text>
          </View>
          <View style={styles.accordionContainer}>
            {HEAT_EMERGENCIES_DROPDOWN_DATA.map((section: AccordionItem) => (
              <AccordionMainItemComponent
                key={section.id}
                section={section}
                isExpanded={expandedSections[section.id]}
                onToggle={toggleMainSection}
                expandedSubSections={expandedSubSections}
                onToggleSubSection={toggleSubSection}
              />
            ))}
          </View>
        </View>

        {/* Section 3: Emergency Contact (Philippines) */}
        <View style={styles.emergencyContactSection}>
          <View style={styles.emergencyContactHeader}>
            <Text style={styles.phoneIcon}>📞</Text>
            <Text style={styles.emergencyContactTitle}>Emergency Contacts (Philippines)</Text>
          </View>
          <Text style={styles.emergencyContactDescription}>
            In case of heatstroke or other medical emergencies, do not hesitate to call for help.
          </Text>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCallPress(EMERGENCY_CONTACTS.national)}
          >
            <Text style={styles.emergencyButtonText}>National Emergency Hotline: {EMERGENCY_CONTACTS.national}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCallPress(EMERGENCY_CONTACTS.redCross)}
          >
            <Text style={styles.emergencyButtonText}>Philippine Red Cross: {EMERGENCY_CONTACTS.redCross}</Text>
          </TouchableOpacity>

          {/* Combined Bureau of Fire Protection Button */}
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCallPress(EMERGENCY_CONTACTS.bureauOfFireProtection1)} // Calls the first number
          >
            <Text style={styles.emergencyButtonText}>Bureau of Fire Protection:</Text>
            <Text style={styles.emergencyButtonText}>{EMERGENCY_CONTACTS.bureauOfFireProtection1}</Text>
            <Text style={styles.emergencyButtonText}>{EMERGENCY_CONTACTS.bureauOfFireProtection2}</Text>
          </TouchableOpacity>


          <Text style={styles.emergencyNote}>
            *Note: Local emergency numbers may vary by city/municipality. It's always best to know your local
            emergency services number.*
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.headerText, // Updated color here
  },
  // Carousel Styles
  carouselContentContainer: {
    // No specific padding needed here as cards handle their own margins
  },
  carouselCard: {
    width: width * 0.9,
    marginHorizontal: width * 0.05 / 2,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  carouselDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.dotInactive,
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
  },

  // Accordion Styles for Heat Emergencies
  accordionContainer: {
    paddingHorizontal: 15,
  },
  accordionMainItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  accordionMainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6', // Slightly darker border than header background
  },
  accordionMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  accordionMainContent: {
    paddingVertical: 10,
    backgroundColor: COLORS.background, // Match main background for consistency
  },
  accordionSubItem: {
    marginBottom: 5,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  accordionSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.subheaderBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef', // Slightly darker border than subheader background
  },
  accordionSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  accordionSubContent: {
    padding: 15,
    paddingTop: 5,
    backgroundColor: COLORS.cardBackground,
  },
  detailHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 3,
    lineHeight: 20,
  },
  detailWarningText: {
    fontSize: 14,
    color: COLORS.textWarning,
    fontWeight: 'bold',
    marginTop: 10,
    lineHeight: 20,
  },

  // Emergency Contact Styles
  emergencyContactSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 20,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 30,
  },
  emergencyContactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  phoneIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  emergencyContactTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.headerText, // Updated color here
  },
  emergencyContactDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  emergencyButton: {
    backgroundColor: COLORS.textWarning, // Using warning color for emergency button
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'flex-start', // Aligns content (Text components) to the left
    width: '100%', // Ensures the button takes full width for alignment to be noticeable
    justifyContent: 'center',
    shadowColor: COLORS.textWarning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  emergencyButtonText: {
    color: COLORS.cardBackground, // White text on emergency button
    fontSize: 18,
    fontWeight: 'bold',
    // No explicit textAlign needed here as parent's alignItems handles it
  },
  emergencyNote: {
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default function Index() {
  return <SafetyTipsPage />;
}