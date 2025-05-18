// Product details data for use in both preview modals and product detail pages
import hdpePipes from '@assets/HDPE pipes (PE pipes) .png';
import manholeD400 from '@assets/Manhole cover D400(K) .png';
import rainwaterGrillD400 from '@assets/Rainwater grill D400 1 .png';
import rainwaterGrillD4002 from '@assets/Rainwater grill D400 2 .png';
import rainwaterGrillMeria from '@assets/Rainwater grill D400 MERIA .png';
import rainwaterGrillF900 from '@assets/Rainwater grill F900 .png';
// Import the Chinese product details map
import { zhCNProductDetailsMap as importedChineseProductMap } from './product-details-zh-CN';
import drainageGrateC250 from '@assets/Drainage channel 5066 high-resistance spherical graphite cast iron, C250 EN 1433 .png';
import drainageGrateHighRes from '@assets/Rainwater grill high-resistance spherical graphite cast iron, GGG50 E600 EN 1433.png';
import steelPipesOilGas from '@assets/Steel Pipes For Oil and Gas Purpose .png';
import gateValve from '@assets/Gate valve cast iron DN50-500, PN10-16 .png';
import groundFireHydrant from '@assets/Ground fire hydrant .png';
import reducerSmall from '@assets/Reducer 25-125 (Injection) .png';
import reducerMedium from '@assets/Reducer 140-200 (Injection) .png';
import teeSmall from '@assets/Reduced TEE 90°125-225 (Injection) .png';
import teeLarge from '@assets/Reduced TEE 90° 250-400 (Injection) .png';
import wellFacility from '@assets/Well facility .png';
import wasteBox from '@assets/Waste box 30 l .png';
import weldedWireMesh from '@assets/Welded wire mesh .jpg';
import wireMeshGate from '@assets/Wire mesh gate .jpg';
import doubleCorrugatedPipes from '@assets/Double corrugated pipes .png';
import steelReinforcedPipe from '@assets/Steel reinforced corrugated polyethilene pipe.png';

// Import aluminum profile images from attached assets
import uProfiles from '@assets/Aluminum U-Profiles.jpg';
import tProfiles from '@assets/Aluminum T-Profiles.jpg';
import ledProfiles from '@assets/Aluminum LED Profile.jpg';
import specialProfiles from '@assets/Aluminum-Profile-Extrusion.jpg';

// Create compatibility variables for old references
const standardProfiles = uProfiles;
const machineProfiles = tProfiles;

// Log paths to debug
console.log('Aluminum profile image paths:', {
  uProfiles,
  tProfiles,
  ledProfiles,
  specialProfiles
});
import elbow90 from '@assets/Elbow 90° (Injection) fitting .png';
import equalTee from '@assets/Equal TEE 90° (Injection) fitting .png';
import hsawPilesWater from '@assets/Helical Submerged Arc Welded (HSAW) Pipes For Water Purpose.png';
import hsawPilesPurpose from '@assets/Helical Submerged Arc Welded (HSAW) Pipes For Pile Purpose.png';
import elbow45 from '@assets/Elbow 45° (Injection) fitting .png';
import flangeAdapterLong from '@assets/Flange adapter-long type 20-355 (Injection).png';
import flangeAdapterShort from '@assets/Flange adapter-Short type (Injection) .png';

export interface Document {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  category?: string;
  language: string;
  createdAt?: Date;
}

export interface ProductDetails {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  status?: string;
  features: string[];
  applications: string[];
  specifications?: Record<string, string>;
  link?: string;
  documents?: Document[];
}

// English product details map (default)
const enProductDetailsMap: Record<string, ProductDetails> = {
  // Aluminum Profiles
  'standard-profiles': {
    id: 'standard-profiles',
    title: 'Aluminum U-Profiles',
    description: 'Versatile U-shaped aluminum extrusions ideal for framing, edge protection, and structural applications with excellent load-bearing characteristics.',
    image: uProfiles,
    category: 'aluminum',
    features: [
      'Uniform wall thickness',
      'EN AW-6063/6060 T5/T6 high-grade alloy',
      'Superior surface finish quality',
      'Excellent strength-to-weight ratio',
      'Multiple size options available'
    ],
    applications: [
      'Furniture manufacturing',
      'Interior design elements',
      'Display systems',
      'General construction',
      'Decorative elements'
    ],
    specifications: {
      'Material': 'Aluminum alloy EN AW-6060, EN AW-6063',
      'Alloy Temper': 'T5, T6',
      'Surface Finish': 'Mill finish, anodized, powder-coated',
      'Standard Length': '6000 mm (±10 mm)',
      'Production Method': 'Hot extrusion'
    }
  },
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: 'Aluminum T-Profiles',
    description: 'Precision T-shaped aluminum extrusions designed for structural applications, partitions, and support systems with excellent rigidity and load distribution.',
    image: tProfiles,
    category: 'aluminum',
    features: [
      'Precision T-shaped design',
      'High structural integrity',
      'Clean edges and precise dimensions',
      'Easy to cut and fabricate',
      'Available in multiple sizes'
    ],
    applications: [
      'Industrial automation',
      'Manufacturing equipment',
      'Protective enclosures',
      'Robotic frameworks',
      'Conveyor systems'
    ],
    specifications: {
      'Material': 'Aluminum alloy EN AW-6060, EN AW-6063',
      'Alloy Temper': 'T5, T6',
      'Surface Finish': 'Natural, anodized 10μm',
      'Standard Length': '6000 mm (±10 mm)',
      'Special Features': 'T-slot system, modular compatibility'
    }
  },
  'led-profiles': {
    id: 'led-profiles',
    title: 'LED Aluminum Profiles',
    description: 'Professional LED housing profiles with integrated diffusion lenses, optimized heat dissipation, and concealed mounting for architectural and commercial lighting.',
    image: ledProfiles,
    category: 'aluminum',
    features: [
      'Superior heat sink properties',
      'Integrated diffuser lens options',
      'Recessed and surface mounting',
      'Anodized finish in multiple colors',
      'Custom cut lengths available'
    ],
    applications: [
      'Interior lighting',
      'Architectural illumination',
      'Display showcase lighting',
      'Cabinet and furniture lighting',
      'Commercial space lighting'
    ],
    specifications: {
      'Material': 'Aluminum alloy EN AW-6060, EN AW-6063',
      'Surface Finish': 'Anodized (silver, black, white, custom)',
      'LED Compatibility': 'Strip LEDs up to 20mm width',
      'Diffuser Options': 'Clear, frosted, opal',
      'Mounting': 'Surface, recessed, suspended, corner'
    }
  },
  'special-profiles-en': {
    id: 'special-profiles',
    title: 'Special Aluminum Profiles',
    description: 'Custom-engineered aluminum extrusions with complex geometries and specialized features for unique industrial applications and technical solutions.',
    image: specialProfiles,
    category: 'aluminum',
    features: [
      'Complex cross-section designs',
      'CNC machining capabilities',
      'Custom-developed solutions',
      'Integrated functional elements',
      'High-performance alloys (6063-T5/T6)'
    ],
    applications: [
      'Transportation industry',
      'Specialized building systems',
      'Automotive components',
      'Medical equipment',
      'Defense and aerospace'
    ],
    specifications: {
      'Material': 'Aluminum alloy EN AW-6060, EN AW-6063, EN AW-6082',
      'Surface Finish': 'Custom finishes available',
      'Design Service': 'Full technical support and consultation',
      'Minimum Order': 'Variable based on complexity',
      'Special Features': 'Custom geometries, complex cross-sections'
    }
  },
  'special-profiles': {
    id: 'special-profiles',
    title: 'Special Aluminum Profiles',
    description: 'Custom-engineered aluminum extrusions with complex geometries and specialized features for unique industrial applications and technical solutions.',
    image: specialProfiles,
    category: 'aluminum',
    features: [
      'Complex cross-section designs',
      'CNC machining capabilities',
      'Custom-developed solutions',
      'Integrated functional elements',
      'High-performance alloys (6063-T5/T6)'
    ],
    applications: [
      'Transportation industry',
      'Specialized building systems',
      'Automotive components',
      'Medical equipment',
      'Defense and aerospace'
    ],
    specifications: {
      'Material': 'Aluminum alloy EN AW-6060, EN AW-6063, EN AW-6082',
      'Surface Finish': 'Custom finishes available',
      'Design Service': 'Full technical support and consultation',
      'Minimum Order': 'Variable based on complexity',
      'Special Features': 'Custom geometries, complex cross-sections'
    }
  },
  
  // Infrastructure Products
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: 'HDPE Pipes',
    description: 'High-density polyethylene pipes with excellent chemical resistance for water, gas, and sewage systems.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'High chemical resistance',
      'Long service life (50+ years)',
      'Excellent crack resistance',
      'Good abrasion resistance',
      'Flexible and lightweight material'
    ],
    applications: [
      'Drinking water supply systems',
      'Gas distribution networks',
      'Industrial fluid transport',
      'Sewage systems',
      'Agricultural irrigation'
    ],
    specifications: {
      'Material': 'PE100 (High-density polyethylene)',
      'Standard': 'EN 12201, ISO 4427',
      'Diameter Range': '20mm to 1200mm',
      'Pressure Rating': 'PN4 to PN25',
      'Color': 'Black with blue stripes (water) or yellow stripes (gas)',
      'Connection': 'Butt fusion, electrofusion, or mechanical connections'
    }
  },
  'double-corrugated-pipes': {
    id: 'double-corrugated-pipes',
    title: 'Double-Wall Corrugated Pipes',
    description: 'Double-wall corrugated polyethylene pipes for drainage and sewage with enhanced rigidity and flow characteristics.',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      'High ring stiffness',
      'Light and easy installation',
      'Chemical resistance',
      'Long service life (over 50 years)',
      'Resistance to aggressive soil'
    ],
    applications: [
      'Stormwater drainage systems',
      'Road drainage systems',
      'Domestic sewage collection',
      'Agricultural drainage systems',
      'Cable conduit and pipeline protection'
    ],
    specifications: {
      'Material': 'HDPE (High-density polyethylene)',
      'Standard': 'EN 13476',
      'Diameter Range': '110mm to 1000mm',
      'Ring Stiffness': 'SN4, SN8, SN16 kN/m²',
      'Color': 'Black exterior, green or blue interior',
      'Connection': 'Socket connection with rubber sealing ring'
    }
  },
  'reinforced-corrugated-pipes': {
    id: 'reinforced-corrugated-pipes',
    title: 'Steel-Reinforced Corrugated Pipes',
    description: 'Steel-reinforced polyethylene corrugated pipes with enhanced structural integrity for challenging conditions.',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      'Enhanced strength and abrasion resistance',
      'Resistance to heavy loads',
      'Improved deformation resistance',
      'Maintained polyethylene flexibility',
      'Enhanced resistance to temperature variations'
    ],
    applications: [
      'High-pressure conveyance',
      'Underground utilities',
      'Mining operations',
      'Marine pipelines',
      'Difficult geological conditions'
    ],
    specifications: {
      'Reinforcement Type': 'Steel cord or fiberglass',
      'Diameter': '50-1200 mm',
      'Working Pressure': 'Up to 30 bar',
      'Resistance to': 'UV radiation, low temperatures',
      'Temperature Range': '-40°C to +60°C'
    }
  },
  'triple-wall-pipes': {
    id: 'triple-wall-pipes',
    title: 'Triple-Wall Pipes',
    description: 'Advanced triple-wall polyethylene pipes with exceptional rigidity and impact resistance for heavy-duty applications.',
    image: steelReinforcedPipe, // Temporary reuse
    category: 'polyethylene',
    features: [
      'Superior crush resistance',
      'Extreme load-bearing capacity',
      'Enhanced hydraulic performance',
      'Exceptional impact resistance',
      'Extended service life in harsh environments'
    ],
    applications: [
      'Heavy traffic road drainage',
      'Airport infrastructure',
      'Railway drainage systems',
      'Deep installation projects',
      'Industrial heavy-load areas'
    ],
    specifications: {
      'Wall Type': 'Triple-wall construction',
      'Material': 'HDPE with special stabilizers',
      'Ring Stiffness': 'Up to SN16',
      'Installation Depth': 'Suitable for depths up to 8m',
      'Diameter Range': '200mm to 1000mm',
      'Design Life': '100+ years'
    }
  },
  'elbow-fittings': {
    id: 'elbow-fittings',
    title: '90° Elbow Fittings',
    description: '90° elbows for polyethylene piping systems, providing direction changes in pipeline networks.',
    image: elbow90,
    category: 'fittings',
    features: [
      'Precise 90° direction change',
      'Seamless integration with pipe systems',
      'Identical material properties to main pipes',
      'Available in various angles',
      'Compatible with all joining methods'
    ],
    applications: [
      'Direction changes in pipeline systems',
      'Water distribution networks',
      'Gas distribution systems',
      'Sewage systems',
      'Industrial fluid transport'
    ],
    specifications: {
      'Material': 'PE100 high-density polyethylene',
      'Angles': '90°, as well as 45° and others',
      'Diameter Range': '20mm to 800mm',
      'Pressure Rating': 'Matches connected pipelines',
      'Connection': 'Butt fusion, electrofusion, or flange connection'
    }
  },
  'tee-fittings': {
    id: 'tee-fittings',
    title: 'T-Joint Fittings',
    description: 'T-joint connectors for polyethylene piping systems, allowing three-way flow division or combination.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Even flow distribution',
      'Durable construction',
      'Precise geometry',
      'Various diameter options',
      'Equal and reducing models'
    ],
    applications: [
      'Water distribution networks',
      'Gas distribution systems',
      'Sewage systems',
      'Irrigation systems',
      'Industrial fluid transport'
    ],
    specifications: {
      'Material': 'PE100 high-density polyethylene',
      'Types': 'Equal and reducing',
      'Diameter Range': '20mm to 800mm',
      'Pressure Rating': 'Matches connected pipelines',
      'Connection': 'Butt fusion, electrofusion, or flange connection'
    }
  },
  'hsaw-pipes': {
    id: 'hsaw-pipes',
    title: 'HSAW Steel Pipes',
    description: 'Helical Submerged Arc Welded pipes with high-precision welding technology for water infrastructure.',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      'High strength and structural integrity',
      'Precision spiral welding technology',
      'Enhanced corrosion protection',
      'Suitable for large diameter and thick walls',
      'Cost-effective manufacturing process'
    ],
    applications: [
      'Municipal water transmission',
      'High-capacity water mains',
      'Industrial water systems',
      'Water pumping stations',
      'Water storage systems'
    ],
    specifications: {
      'Material': 'Carbon steel',
      'Standard': 'API 5L, AWWA C200',
      'Diameter': '400mm to 3000mm',
      'Wall Thickness': '6mm to 25mm',
      'Coating': 'FBE, 3LPE, cement mortar, or epoxy',
      'Connection': 'Welded or flange connections'
    }
  },
  'oil-gas-pipes': {
    id: 'oil-gas-pipes',
    title: 'Oil and Gas Pipes',
    description: 'High-pressure steel pipes specifically designed for oil and gas transportation with exceptional corrosion resistance.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'High-pressure resistance',
      'Enhanced corrosion protection',
      'API 5L compliance',
      'X42 to X70 steel grades',
      'Specialized coating options'
    ],
    applications: [
      'Crude oil transportation',
      'Natural gas pipelines',
      'Refinery operations',
      'Offshore platforms',
      'Distribution networks'
    ],
    specifications: {
      'Type': 'Seamless or welded',
      'Standard': 'API 5L, ISO 3183',
      'Diameter': '114.3mm to 1219.2mm',
      'Wall Thickness': '6.4mm to 25.4mm',
      'Coating': 'FBE, 3LPE, or 3LPP',
      'Operating Temperature': '-45°C to +80°C'
    }
  },
  'pile-pipes': {
    id: 'pile-pipes',
    title: 'Piling Pipes',
    description: 'High-strength Helical Submerged Arc Welded steel pipes (HSAW) for deep foundations and shoreline reinforcements.',
    image: hsawPilesPurpose,
    category: 'steel',
    features: [
      'Extremely high structural strength',
      'Optimized weight-to-strength ratio',
      'Precision spiral welding technology',
      'Specifically engineered for underwater and soil conditions',
      'Versatile tip and joint options'
    ],
    applications: [
      'Deep pile foundations',
      'Harbor constructions and piers',
      'Shoreline reinforcement',
      'Bridges and viaducts',
      'Heavy structure support'
    ],
    specifications: {
      'Material': 'High-strength carbon steel',
      'Diameter': '300mm to 3000mm',
      'Wall Thickness': '8mm to 40mm',
      'Welding Process': 'Helical Submerged Arc Welding (HSAW)',
      'Surface Treatment': 'Shot-blasted and primed',
      'Strength Grade': 'S355, S420 or higher'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: 'Manhole Covers',
    description: 'Durable cast iron manhole covers and frames for urban infrastructure with various load classifications.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Durable cast iron construction',
      'Various load classifications (A15 to F900)',
      'Anti-theft design options',
      'Additional locking systems',
      'Customizable surface patterns'
    ],
    applications: [
      'Road infrastructure',
      'Pedestrian areas',
      'Commercial spaces',
      'Industrial areas',
      'Urban drainage systems'
    ],
    specifications: {
      'Material': 'Ductile iron GGG50/GJS-500-7',
      'Standard': 'EN 124',
      'Load Class': 'D400 (40 tonnes)',
      'Coating': 'Water-based black bitumen paint',
      'Clear Opening': 'Clear opening depends on model',
      'Installation': 'Embedding in concrete or asphalt'
    }
  },
  'drainage-grates': {
    id: 'drainage-grates',
    title: 'Drainage Grates',
    description: 'Cast iron drainage grates for stormwater collection systems, designed for various traffic loads and flow capacities.',
    image: drainageGrateC250,
    category: 'cast_iron',
    features: [
      'High-strength cast iron construction',
      'Various load classifications available',
      'Optimized water flow design',
      'Anti-slip surface patterns',
      'Compatible with standard drainage channels'
    ],
    applications: [
      'Urban sidewalks and pedestrian areas',
      'Parking lots and driveways',
      'Commercial spaces',
      'Residential developments',
      'Parks and recreational areas'
    ],
    specifications: {
      'Material': 'Ductile iron GGG50/GJS-500-7',
      'Standard': 'EN 1433',
      'Load Classes': 'C250-E600',
      'Coating': 'Water-based black bitumen paint',
      'Installation': 'Embedding in concrete channels'
    }
  },
  'rainwater-grills': {
    id: 'rainwater-grills',
    title: 'Rainwater Grills',
    description: 'Durable cast iron drainage grills with optimized water intake capacity for urban drainage systems.',
    image: rainwaterGrillD400,
    category: 'cast_iron',
    features: [
      'High load capacity D400 classification',
      'Optimized grate pattern for efficient water collection',
      'Anti-slip surface for pedestrian safety',
      'Various installation options',
      'Long-lasting cast iron construction'
    ],
    applications: [
      'Urban streets and highways',
      'Parking lots and commercial areas',
      'Stormwater collection systems',
      'Pedestrian zones and squares',
      'Industrial areas'
    ],
    specifications: {
      'Material': 'Ductile iron GGG50/GJS-500-7',
      'Standard': 'EN 124',
      'Load Class': 'C250, D400 (25-40 tonnes)',
      'Coating': 'Black bitumen paint',
      'Dimensions': 'Various depending on specifications',
      'Design': 'Grate with optimized hydraulic efficiency'
    }
  },
  'fire-hydrants': {
    id: 'fire-hydrants',
    title: 'Fire Hydrants',
    description: 'Underground fire hydrant systems for efficient firefighting water access in urban and industrial areas.',
    image: groundFireHydrant,
    category: 'cast_iron',
    features: [
      'Quick access design',
      'Secure underground housing',
      'Frost-protected valve system',
      'Self-draining functionality',
      'Standard connection interface'
    ],
    applications: [
      'Urban fire safety networks',
      'Industrial complexes',
      'Commercial spaces',
      'Residential developments',
      'Public institutions'
    ],
    specifications: {
      'Material': 'Ductile iron body',
      'Standard': 'EN 14339',
      'Inlet Connection': 'DN80 to DN150',
      'Outlet Connection': 'Standard firefighting connections',
      'Installation Depth': 'Adjustable to frost line',
      'Pressure Rating': 'PN16'
    }
  },
  'gate-valves': {
    id: 'gate-valves',
    title: 'Gate Valves',
    description: 'Cast iron gate valves for water flow control in municipal and industrial pipeline systems.',
    image: gateValve,
    category: 'cast_iron',
    features: [
      'Full bore flow design',
      'Low pressure drop',
      'Secure sealing system',
      'Corrosion-resistant construction',
      'Handwheel operated mechanism'
    ],
    applications: [
      'Municipal water systems',
      'Industrial fluid control',
      'Fire protection systems',
      'Irrigation networks',
      'Water treatment facilities'
    ],
    specifications: {
      'Material': 'Ductile iron body with EPDM seals',
      'Standard': 'EN 1171, EN 1074-1&2',
      'Diameter Range': 'DN50 to DN500',
      'Pressure Rating': 'PN10, PN16',
      'Stem Type': 'Rising or non-rising',
      'Connection': 'Flanged connection per EN 1092-2'
    }
  },
  // New rainwater grill products
  'rainwater-grill-d400-standard': {
    id: 'rainwater-grill-d400-standard',
    title: 'Rainwater Grill D400',
    description: 'Heavy-duty D400 rainwater grill designed for drainage in high-traffic areas such as roads and commercial zones.',
    image: rainwaterGrillD400,
    category: 'cast_iron',
    features: [
      'Heavy-duty cast iron construction',
      'D400 load classification (40 tons)',
      'Optimized water flow design',
      'Anti-clogging pattern',
      'Secure installation options'
    ],
    applications: [
      'Road drainage systems',
      'Urban infrastructure',
      'Commercial parking areas',
      'Industrial sites',
      'Public spaces'
    ],
    specifications: {
      'Material': 'Ductile cast iron GGG50/GJS-500-7',
      'Standard': 'EN 124',
      'Load class': 'D400 (40 tons)',
      'Coating': 'Black bitumen paint',
      'Dimensions': 'Various models available',
      'Options': 'Hinged or non-hinged versions'
    }
  },
  'rainwater-grill-d400-type2': {
    id: 'rainwater-grill-d400-type2',
    title: 'Rainwater Grill D400 Type 2',
    description: 'Alternative design D400 rainwater grill with improved flow characteristics for drainage in urban environments.',
    image: rainwaterGrillD4002,
    category: 'cast_iron',
    features: [
      'Enhanced water flow design',
      'D400 load classification (40 tons)',
      'Improved anti-clogging geometry',
      'Low-noise design',
      'Optimized for high capacity drainage'
    ],
    applications: [
      'City center drainage systems',
      'Commercial areas',
      'Parking facilities',
      'Pedestrian zones with vehicle access',
      'Public transportation routes'
    ],
    specifications: {
      'Material': 'Ductile cast iron GGG50/GJS-500-7',
      'Standard': 'EN 124',
      'Load class': 'D400 (40 tons)',
      'Coating': 'Black bitumen paint',
      'Dimensions': '500×500mm (clear opening)',
      'Features': 'Ergonomic lifting points'
    }
  },
  'hdpe-pipes-alt': {
    id: 'hdpe-pipes-alt',
    title: 'HDPE Pipes (PE100)',
    description: 'High-density polyethylene pipes with excellent chemical resistance for water, gas, and wastewater systems.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'High chemical resistance',
      'Long service life (50+ years)',
      'Excellent stress crack resistance',
      'Good abrasion resistance',
      'Flexible and lightweight'
    ],
    applications: [
      'Drinking water supply systems',
      'Gas distribution networks',
      'Industrial fluid transport',
      'Wastewater systems',
      'Agricultural irrigation'
    ],
    specifications: {
      'Material': 'PE100 (High-density polyethylene)',
      'Standard': 'EN 12201, ISO 4427',
      'Diameters': '20mm to 1200mm',
      'Pressure classes': 'PN4 to PN25',
      'Color': 'Black with blue stripes (water) or yellow stripes (gas)',
      'Connection': 'Butt fusion, electrofusion, or mechanical joints'
    }
  },
  'manhole-covers-large': {
    id: 'manhole-covers-large',
    title: 'Manhole Covers & Frames',
    description: 'Heavy-duty cast iron manhole covers and frames for urban infrastructure with various load classifications.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Durable cast iron construction',
      'Various load classifications (A15 to F900)',
      'Anti-theft design options',
      'Optional locking systems',
      'Customizable surface patterns'
    ],
    applications: [
      'Road infrastructure',
      'Pedestrian areas',
      'Commercial zones',
      'Industrial sites',
      'Urban drainage systems'
    ],
    specifications: {
      'Material': 'Ductile cast iron GGG50/GJS-500-7',
      'Standard': 'EN 124',
      'Load classes': 'D400 (40 tons)',
      'Coating': 'Water-based black bitumen paint',
      'Opening': 'Clear opening varies by model',
      'Installation': 'Bedding in concrete or asphalt'
    }
  },
  'rainwater-grill-meria': {
    id: 'rainwater-grill-meria',
    title: 'Rainwater Grill MERIA Series',
    description: 'Premium MERIA design rainwater grill for modern urban landscapes, combining functionality with aesthetic appeal.',
    image: rainwaterGrillMeria,
    category: 'cast_iron',
    features: [
      'Distinctive MERIA pattern design',
      'D400 load classification (40 tons)',
      'Superior hydraulic efficiency',
      'Enhanced slip resistance',
      'Architectural-grade finish'
    ],
    applications: [
      'City centers and public squares',
      'Pedestrian-friendly urban zones',
      'Commercial districts',
      'Historic preservation areas',
      'Premium landscape developments'
    ],
    specifications: {
      'Material': 'Ductile cast iron GGG50/GJS-500-7',
      'Standard': 'EN 124',
      'Load class': 'D400 (40 tons)',
      'Coating': 'Premium black bitumen paint',
      'Dimensions': '500×500mm (clear opening)',
      'Features': 'Anti-theft locking system'
    }
  },
  'rainwater-grill-f900': {
    id: 'rainwater-grill-f900',
    title: 'Rainwater Grill F900 Heavy-Duty',
    description: 'Ultra heavy-duty F900 rainwater grill designed for extreme load conditions in industrial and port environments.',
    image: rainwaterGrillF900,
    category: 'cast_iron',
    features: [
      'Maximum load capacity F900 (90 tons)',
      'Reinforced structural design',
      'Industrial-grade durability',
      'High-flow capacity',
      'Extreme environment resistance'
    ],
    applications: [
      'Airport runways and taxiways',
      'Container terminals and ports',
      'Heavy industrial zones',
      'Logistics centers',
      'Military facilities'
    ],
    specifications: {
      'Material': 'High-strength ductile cast iron GGG60',
      'Standard': 'EN 124',
      'Load class': 'F900 (90 tons)',
      'Coating': 'Heavy-duty corrosion-resistant paint',
      'Dimensions': 'Various industrial sizes',
      'Installation': 'Specialized high-strength bedding required'
    }
  },
  'steel-pipes-oil-gas': {
    id: 'steel-pipes-oil-gas',
    title: 'Steel Pipes for Oil & Gas',
    description: 'High-pressure steel pipes specially designed for oil and gas transportation with superior corrosion resistance.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'High-pressure resistance',
      'Advanced corrosion protection',
      'API 5L compliance',
      'X42 to X70 steel grades',
      'Specialized coating options'
    ],
    applications: [
      'Crude oil transportation',
      'Natural gas pipelines',
      'Petroleum refineries',
      'Offshore platforms',
      'Distribution networks'
    ],
    specifications: {
      'Type': 'Seamless or welded',
      'Standard': 'API 5L, ISO 3183',
      'Diameter': '114.3mm to 1219.2mm',
      'Wall thickness': '6.4mm to 25.4mm',
      'Coating': 'FBE, 3LPE, or 3LPP',
      'Operating temperature': '-45°C to +80°C'
    }
  },
  'ground-fire-hydrant': {
    id: 'ground-fire-hydrant',
    title: 'Ground Fire Hydrant',
    description: 'Underground fire hydrant system for efficient firefighting water access in urban and industrial areas.',
    image: groundFireHydrant,
    category: 'cast_iron',
    features: [
      'Quick access design',
      'Traffic-safe underground installation',
      'Frost-protected valve system',
      'Self-draining capability',
      'Standard connection interface'
    ],
    applications: [
      'Urban fire protection networks',
      'Industrial complexes',
      'Commercial districts',
      'Residential developments',
      'Public facilities'
    ],
    specifications: {
      'Material': 'Ductile cast iron body',
      'Standard': 'EN 14339',
      'Inlet connection': 'DN80 to DN150',
      'Outlet connection': 'Standard firefighting couplings',
      'Installation depth': 'Adjustable to frost line',
      'Pressure rating': 'PN16'
    }
  },
  'gate-valve': {
    id: 'gate-valve',
    title: 'Cast Iron Gate Valve',
    description: 'Resilient-seated gate valve for water and wastewater systems, featuring full-port design for minimal flow restriction.',
    image: gateValve,
    category: 'cast_iron',
    features: [
      'Full-port design for maximum flow',
      'Resilient wedge seating',
      'Non-rising stem design',
      'EPDM rubber sealing',
      'Epoxy powder coating protection'
    ],
    applications: [
      'Municipal water distribution',
      'Wastewater treatment systems',
      'Industrial water systems',
      'Fire protection networks',
      'Irrigation systems'
    ],
    specifications: {
      'Material': 'Ductile cast iron GGG50',
      'Standard': 'EN 1074-1/2, EN 1171',
      'Size range': 'DN50 to DN500',
      'Pressure rating': 'PN10/16',
      'Temperature range': '-20°C to +70°C',
      'Connection': 'Flanged ends (EN 1092-2)'
    }
  },
  'waste-box': {
    id: 'waste-box',
    title: 'Urban Waste Collection Box',
    description: 'Modern, durable waste collection box for urban environments with ergonomic design and weather resistance.',
    image: wasteBox,
    category: 'urban infrastructure',
    features: [
      'Weather-resistant construction',
      'Ergonomic opening mechanism',
      'Easy emptying system',
      'Pest-resistant design',
      'UV stabilized materials'
    ],
    applications: [
      'City streets and parks',
      'Bus stops and transit stations',
      'Commercial areas',
      'Educational institutions',
      'Recreational facilities'
    ],
    specifications: {
      'Material': 'High-impact polyethylene with metal frame',
      'Capacity': '30 liters',
      'Dimensions': '400×300×700mm',
      'Installation': 'Surface mount or post-mount options',
      'Features': 'Cigarette extinguisher, recycling options',
      'Color': 'Various municipal options available'
    }
  }
};

// Russian language product details
const ruProductDetailsMap: Record<string, ProductDetails> = {
  // Russian aluminum product categories
  
  // Aluminum profiles
  'standard-profiles': {
    id: 'standard-profiles',
    title: 'Алюминиевые U-профили',
    description: 'Универсальные U-образные алюминиевые профили для обрамления, защиты краёв и структурных применений с отличными характеристиками нагрузки.',
    image: uProfiles,
    category: 'aluminum',
    features: [
      'Равномерная толщина стенки',
      'Сплав высокого качества EN AW-6063/6060 T5/T6',
      'Превосходное качество поверхности',
      'Отличное соотношение прочности к весу',
      'Доступны в различных размерах'
    ],
    applications: [
      'Производство мебели',
      'Элементы интерьера',
      'Системы отображения',
      'Общее строительство',
      'Декоративные элементы'
    ],
    specifications: {
      'Материал': 'Алюминиевый сплав EN AW-6060, EN AW-6063',
      'Состояние сплава': 'T5, T6',
      'Отделка поверхности': 'Заводская, анодированная, порошковое покрытие',
      'Стандартная длина': '6000 мм (±10 мм)',
      'Метод производства': 'Горячая экструзия'
    }
  },
  
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: 'Алюминиевые T-профили',
    description: 'Точные T-образные алюминиевые профили, предназначенные для структурных применений, перегородок и опорных систем с отличной жесткостью и распределением нагрузки.',
    image: tProfiles,
    category: 'aluminum',
    features: [
      'Точный T-образный дизайн',
      'Высокая структурная целостность',
      'Чистые края и точные размеры',
      'Легко режутся и обрабатываются',
      'Доступны в различных размерах'
    ],
    applications: [
      'Промышленная автоматизация',
      'Производственное оборудование',
      'Защитные ограждения',
      'Каркасы для роботов',
      'Конвейерные системы'
    ],
    specifications: {
      'Материал': 'Алюминиевый сплав EN AW-6060, EN AW-6063',
      'Состояние сплава': 'T5, T6',
      'Отделка поверхности': 'Натуральная, анодированная 10μm',
      'Стандартная длина': '6000 мм (±10 мм)',
      'Особенности': 'T-образная система, модульная совместимость'
    }
  },
  
  'led-profiles': {
    id: 'led-profiles',
    title: 'LED Алюминиевые Профили',
    description: 'Профессиональные профили для светодиодного освещения с интегрированными рассеивающими линзами, оптимизированным теплоотводом и скрытым креплением для архитектурного и коммерческого освещения.',
    image: ledProfiles,
    category: 'aluminum',
    features: [
      'Превосходные свойства теплоотвода',
      'Варианты интегрированных рассеивающих линз',
      'Встроенное и поверхностное монтирование',
      'Анодированная отделка в разных цветах',
      'Возможность нарезки по индивидуальным размерам'
    ],
    applications: [
      'Внутреннее освещение',
      'Архитектурная подсветка',
      'Освещение витрин',
      'Подсветка шкафов и мебели',
      'Освещение коммерческих пространств'
    ],
    specifications: {
      'Материал': 'Алюминиевый сплав EN AW-6060, EN AW-6063',
      'Отделка поверхности': 'Анодированная (серебро, черный, белый, на заказ)',
      'Совместимость LED': 'Светодиодные ленты шириной до 20мм',
      'Варианты рассеивателей': 'Прозрачный, матовый, опаловый',
      'Монтаж': 'Поверхностный, встроенный, подвесной, угловой'
    }
  },
  
  'special-profiles-ru2': {
    id: 'special-profiles',
    title: 'Специальные Алюминиевые Профили',
    description: 'Специально спроектированные алюминиевые профили со сложной геометрией и специализированными характеристиками для уникальных промышленных применений и технических решений.',
    image: specialProfiles,
    category: 'aluminum',
    features: [
      'Дизайн со сложным поперечным сечением',
      'Возможности ЧПУ-обработки',
      'Индивидуально разработанные решения',
      'Интегрированные функциональные элементы',
      'Высокоэффективные сплавы (6063-T5/T6)'
    ],
    applications: [
      'Транспортная промышленность',
      'Специализированные строительные системы',
      'Автомобильные компоненты',
      'Медицинское оборудование',
      'Оборонная и аэрокосмическая промышленность'
    ],
    specifications: {
      'Материал': 'Алюминиевый сплав EN AW-6060, EN AW-6063, EN AW-6082',
      'Отделка поверхности': 'Доступны индивидуальные варианты отделки',
      'Проектирование': 'Полная техническая поддержка и консультации',
      'Минимальный заказ': 'Варьируется в зависимости от сложности',
      'Особенности': 'Индивидуальная геометрия, сложные сечения'
    }
  },
  
  // Polyethylene pipes
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: 'Трубы HDPE',
    description: 'Трубы из полиэтилена высокой плотности с отличной химической стойкостью для водных, газовых и канализационных систем.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Высокая химическая стойкость',
      'Длительный срок службы (более 50 лет)',
      'Отличная стойкость к растрескиванию',
      'Хорошая стойкость к истиранию',
      'Гибкий и легкий материал'
    ],
    applications: [
      'Системы питьевого водоснабжения',
      'Газораспределительные сети',
      'Промышленный транспорт жидкостей',
      'Канализационные системы',
      'Сельскохозяйственное орошение'
    ],
    specifications: {
      'Материал': 'PE100 (полиэтилен высокой плотности)',
      'Стандарт': 'EN 12201, ISO 4427',
      'Диапазон диаметров': 'от 20мм до 1200мм',
      'Номинальное давление': 'PN4 до PN25',
      'Цвет': 'Черный с синими полосами (вода) или желтыми полосами (газ)',
      'Соединение': 'Стыковая сварка, электросварка или механические соединения'
    }
  },
  
  'double-corrugated-pipes': {
    id: 'double-corrugated-pipes',
    title: 'Двустенные гофрированные трубы',
    description: 'Двустенные гофрированные полиэтиленовые трубы для дренажа и канализации с улучшенной жесткостью и характеристиками потока.',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      'Высокая кольцевая жесткость',
      'Легкость и простота установки',
      'Химическая стойкость',
      'Длительный срок службы (более 50 лет)',
      'Устойчивость к агрессивным почвам'
    ],
    applications: [
      'Системы ливневой канализации',
      'Дренажные системы дорог',
      'Сбор бытовых сточных вод',
      'Системы сельскохозяйственного дренажа',
      'Кабельные каналы и защита трубопроводов'
    ],
    specifications: {
      'Материал': 'HDPE (полиэтилен высокой плотности)',
      'Стандарт': 'EN 13476',
      'Диапазон диаметров': 'от 110мм до 1000мм',
      'Кольцевая жесткость': 'SN4, SN8, SN16 кН/м²',
      'Цвет': 'Черный снаружи, зеленый или синий внутри',
      'Соединение': 'Раструбное соединение с резиновым уплотнительным кольцом'
    }
  },
  
  'reinforced-corrugated-pipes': {
    id: 'reinforced-corrugated-pipes',
    title: 'Трубы PE с стальным армированием',
    description: 'Полиэтиленовые гофрированные трубы со стальным армированием с улучшенной структурной целостностью для сложных условий.',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      'Повышенная прочность и стойкость к истиранию',
      'Устойчивость к тяжелым нагрузкам',
      'Улучшенная устойчивость к деформации',
      'Сохранение гибкости полиэтилена',
      'Повышенная устойчивость к температурным колебаниям'
    ],
    applications: [
      'Транспортировка под высоким давлением',
      'Подземные коммуникации',
      'Горнодобывающие операции',
      'Морские трубопроводы',
      'Сложные геологические условия'
    ],
    specifications: {
      'Тип армирования': 'Стальной корд или стекловолокно',
      'Диаметр': '50-1200 мм',
      'Рабочее давление': 'До 30 бар',
      'Устойчивость к': 'УФ-излучению, низким температурам',
      'Температурный диапазон': 'от -40°C до +60°C'
    }
  },
  
  // Steel pipes
  'hsaw-pipes': {
    id: 'hsaw-pipes',
    title: 'Стальные трубы HSAW',
    description: 'Спирально-сварные стальные трубы с высокоточной технологией сварки для водной инфраструктуры.',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      'Высокая прочность и структурная целостность',
      'Технология прецизионной спиральной сварки',
      'Улучшенная защита от коррозии',
      'Подходит для большого диаметра и толстых стенок',
      'Экономичный производственный процесс'
    ],
    applications: [
      'Муниципальная передача воды',
      'Водопроводы высокой пропускной способности',
      'Промышленные водные системы',
      'Насосные станции',
      'Системы хранения воды'
    ],
    specifications: {
      'Материал': 'Углеродистая сталь',
      'Стандарт': 'API 5L, AWWA C200',
      'Диаметр': 'от 400мм до 3000мм',
      'Толщина стенки': 'от 6мм до 25мм',
      'Покрытие': 'FBE, 3LPE, цементный раствор или эпоксидное',
      'Соединение': 'Сварное или фланцевое'
    }
  },
  
  'oil-gas-pipes': {
    id: 'oil-gas-pipes',
    title: 'Трубы для нефти и газа',
    description: 'Стальные трубы высокого давления, специально разработанные для транспортировки нефти и газа с исключительной коррозионной стойкостью.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Устойчивость к высокому давлению',
      'Улучшенная защита от коррозии',
      'Соответствие API 5L',
      'Марки стали от X42 до X70',
      'Специализированные варианты покрытия'
    ],
    applications: [
      'Транспортировка сырой нефти',
      'Трубопроводы природного газа',
      'Нефтеперерабатывающие операции',
      'Морские платформы',
      'Распределительные сети'
    ],
    specifications: {
      'Тип': 'Бесшовные или сварные',
      'Стандарт': 'API 5L, ISO 3183',
      'Диаметр': 'от 114.3мм до 1219.2мм',
      'Толщина стенки': 'от 6.4мм до 25.4мм',
      'Покрытие': 'FBE, 3LPE или 3LPP',
      'Рабочая температура': 'от -45°C до +80°C'
    }
  },
  
  // Cast iron products
  'drainage-channel': {
    id: 'drainage-channel',
    title: 'Дренажные Каналы',
    description: 'Дренажные каналы высокой прочности для эффективного отвода воды в городских и промышленных зонах.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Высокая устойчивость к нагрузкам',
      'Эффективный отвод воды',
      'Простая установка',
      'Легкое обслуживание и чистка'
    ],
    applications: [
      'Улицы и дороги',
      'Автостоянки',
      'Промышленные территории',
      'Общественные зоны'
    ]
  },
  'cast-iron': {
    id: 'cast-iron',
    title: 'Изделия из Чугуна',
    description: 'Широкий ассортимент изделий из чугуна для инфраструктуры и строительства с долговечными свойствами.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Высокая прочность и надежность',
      'Устойчивость к коррозии',
      'Долгий срок службы',
      'Соответствие европейским стандартам'
    ],
    applications: [
      'Городская инфраструктура',
      'Системы водоснабжения',
      'Канализационные системы',
      'Дорожное строительство'
    ]
  },
  'aluminum': {
    id: 'aluminum',
    title: 'Алюминиевые Изделия',
    description: 'Качественные алюминиевые изделия для различных промышленных и коммерческих нужд.',
    image: standardProfiles,
    category: 'aluminum',
    features: [
      'Легкая и прочная конструкция',
      'Устойчивость к коррозии',
      'Разнообразные формы и размеры',
      'Экологически чистый материал'
    ],
    applications: [
      'Строительство',
      'Транспортная отрасль',
      'Промышленное применение',
      'Архитектура и дизайн'
    ]
  },
  'urban-infrastructure': {
    id: 'urban-infrastructure',
    title: 'Решения для Городской Инфраструктуры',
    description: 'Решения для городской инфраструктуры с акцентом на устойчивость и функциональность.',
    image: wellFacility,
    category: 'urban_infrastructure',
    features: [
      'Устойчивые материалы',
      'Интегрированные решения',
      'Элементы современного дизайна',
      'Легкая установка и обслуживание'
    ],
    applications: [
      'Парки и зоны отдыха',
      'Городские центры',
      'Общественные территории',
      'Транспортная инфраструктура'
    ]
  },
  'standard-profiles-ru': {
    id: 'standard-profiles',
    title: 'Стандартные алюминиевые профили',
    description: 'Стандартные алюминиевые профили для универсального применения в строительстве, инженерии и дизайне различных форм и размеров.',
    image: standardProfiles,
    category: 'aluminum',
    features: [
      'Широкий спектр стандартных форм',
      'Доступны различные размеры',
      'Высококачественная отделка',
      'Отличное соотношение прочности и веса',
      'Экономичные решения'
    ],
    applications: [
      'Производство мебели',
      'Элементы интерьера',
      'Выставочные системы',
      'Общее строительство',
      'Декоративные элементы'
    ],
    specifications: {
      'Материал': 'Алюминиевый сплав EN AW-6060, EN AW-6063',
      'Состояние сплава': 'T5, T6',
      'Отделка поверхности': 'Без отделки, анодированная, порошковое покрытие',
      'Стандартная длина': '6000 мм (±10 мм)',
      'Метод производства': 'Горячая экструзия'
    }
  },
  
  'machine-building-profiles-ru': {
    id: 'machine-building-profiles',
    title: 'Профили для машиностроения',
    description: 'Специализированные алюминиевые профили для промышленных и машиностроительных применений с повышенной точностью и прочностью.',
    image: machineProfiles,
    category: 'aluminum',
    features: [
      'Высокая точность размеров',
      'Превосходная устойчивость',
      'Возможность модульного соединения',
      'Конструкции с пазами для простой сборки',
      'Совместимость с промышленными системами крепления'
    ],
    applications: [
      'Станки и оборудование',
      'Автоматизированные системы',
      'Промышленные рамы',
      'Производственные линии',
      'Робототехника'
    ],
    specifications: {
      'Материал': 'Алюминиевый сплав EN AW-6063, EN AW-6082',
      'Состояние сплава': 'T5, T6',
      'Точность': 'Повышенная по сравнению со стандартными профилями',
      'Диапазон размеров': 'От 20x20 мм до 80x80 мм',
      'Особенности': 'Различные пазовые системы (включая Т-пазы)'
    }
  },
  
  'led-profiles-ru': {
    id: 'led-profiles',
    title: 'LED профили для освещения',
    description: 'Специальные алюминиевые профили для установки светодиодных лент и создания интегрированных систем освещения.',
    image: ledProfiles,
    category: 'aluminum',
    features: [
      'Опциональные диффузоры и линзы',
      'Встроенные каналы для проводки',
      'Эффективное управление теплом',
      'Скрытый монтаж',
      'Различные варианты установки'
    ],
    applications: [
      'Индивидуальное освещение',
      'Коммерческое освещение',
      'Подсветка мебели',
      'Архитектурное освещение',
      'Декоративные световые акценты'
    ],
    specifications: {
      'Материал': 'Алюминиевый сплав EN AW-6063',
      'Поверхность': 'Анодированная, окрашенная, необработанная',
      'Совместимость': 'Стандартные LED ленты шириной 8-15 мм',
      'Опциональные аксессуары': 'Заглушки, держатели, диффузоры, линзы',
      'Доступные цвета': 'Серебристый, белый, черный, коричневый'
    }
  },
  
  'special-profiles-ru': {
    id: 'special-profiles',
    title: 'Специальные алюминиевые профили',
    description: 'Алюминиевые профили нестандартной геометрии и размеров для конкретных отраслевых и специализированных применений.',
    image: specialProfiles,
    category: 'aluminum',
    features: [
      'Индивидуальный дизайн',
      'Специализированные функциональные особенности',
      'Различные варианты отделки',
      'Интегрированные системные решения',
      'Возможность производства малыми партиями'
    ],
    applications: [
      'Транспортная промышленность',
      'Возобновляемая энергетика',
      'Теплообменники',
      'Радиаторы и охлаждение',
      'Пользовательские строительные системы'
    ],
    specifications: {
      'Материал': 'Алюминиевые сплавы различных серий',
      'Дизайн': 'По спецификации заказчика или отраслевым стандартам',
      'Завершение': 'В соответствии с требованиями применения',
      'Длина': 'Стандартно 6м или по спецификации',
      'Минимальный заказ': 'Зависит от сложности профиля'
    }
  },
  
  // Russian categories
  'polyethylene': {
    id: 'polyethylene',
    title: 'Полиэтилен',
    description: 'Полиэтиленовые продукты высокого качества',
    image: hdpePipes,
    category: 'polyethylene',
    features: [],
    applications: []
  },
  'steel': {
    id: 'steel',
    title: 'Сталь',
    description: 'Стальные продукты высокого качества',
    image: steelPipesOilGas,
    category: 'steel',
    features: [],
    applications: []
  },
  'cast iron': {
    id: 'cast iron',
    title: 'Чугун',
    description: 'Чугунные продукты высокого качества',
    image: manholeD400,
    category: 'cast_iron',
    features: [],
    applications: []
  },
  'fittings': {
    id: 'fittings',
    title: 'Фитинги',
    description: 'Фитинги высокого качества',
    image: teeSmall,
    category: 'fittings',
    features: [],
    applications: []
  },
  'urban infrastructure': {
    id: 'urban infrastructure',
    title: 'Городская инфраструктура',
    description: 'Продукты для городской инфраструктуры',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [],
    applications: []
  },
  
  // Leaving only the first hdpe-pipes entry to fix duplicate key error
  'hdpe-pipes-alt': {
    id: 'hdpe-pipes',
    title: 'ПНД трубы',
    description: 'Трубы из полиэтилена высокой плотности для водоснабжения, газораспределения и канализационных систем.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Высокая прочность и долговечность',
      'Устойчивость к коррозии',
      'Гибкость и простота установки',
      'Герметичность соединений',
      'Экологическая безопасность'
    ],
    applications: [
      'Системы питьевого водоснабжения',
      'Газораспределительные сети',
      'Канализационные системы',
      'Промышленные трубопроводы',
      'Сельскохозяйственное орошение'
    ],
    specifications: {
      'Материал': 'Полиэтилен высокой плотности (ПНД)',
      'Стандарт': 'EN 12201, ГОСТ 18599',
      'Диаметры': '20-630 мм',
      'Класс давления': 'PE80, PE100 (PN6-PN25)',
      'Соединение': 'Электросварное, стыковая сварка',
      'Длина': 'Бухты или отрезки 6-12 м'
    }
  },
  'corrugated-pipes': {
    id: 'corrugated-pipes',
    title: 'Гофрированные трубы',
    description: 'Двустенные гофрированные полиэтиленовые трубы для дренажа и канализации.',
    image: hdpePipes, // Using the same image as HDPE pipes as placeholder
    category: 'polyethylene',
    features: [
      'Высокая кольцевая жесткость',
      'Легкий вес и простота монтажа',
      'Устойчивость к химическим веществам',
      'Долговечность (срок службы 50+ лет)',
      'Устойчивость к агрессивным грунтам'
    ],
    applications: [
      'Ливневые канализационные системы',
      'Дренажные системы',
      'Хозяйственно-бытовая канализация',
      'Защита кабелей и проводов',
      'Сельскохозяйственный дренаж'
    ],
    specifications: {
      'Тип': 'Двустенная гофрированная труба',
      'Стандарт': 'EN 13476',
      'Диаметры': '110-1000 мм',
      'Кольцевая жесткость': 'SN4, SN8, SN16 (кН/м²)',
      'Соединение': 'Раструбное с уплотнительным кольцом',
      'Цвет': 'Черный снаружи, зеленый или синий внутри'
    }
  },
  'reinforced-pipe': {
    id: 'reinforced-pipe',
    title: 'Армированные трубы',
    description: 'Стеклоармированные полиэтиленовые трубы для повышенной структурной целостности в сложных условиях.',
    image: hdpePipes, // Using the same image as HDPE pipes as placeholder
    category: 'polyethylene',
    features: [
      'Повышенная прочность и износостойкость',
      'Устойчивость к большим нагрузкам',
      'Улучшенная стойкость к деформации',
      'Сохранение гибкости полиэтилена',
      'Повышенная устойчивость к температурным колебаниям'
    ],
    applications: [
      'Транспортировка под высоким давлением',
      'Подземные коммуникации',
      'Горнодобывающая промышленность',
      'Морские трубопроводы',
      'Сложные геологические условия'
    ],
    specifications: {
      'Тип армирования': 'Стальной корд или стекловолокно',
      'Диаметр': '50-1200 мм',
      'Рабочее давление': 'До 30 бар',
      'Устойчивость к воздействию': 'УФ-излучение, низкие температуры',
      'Температурный режим': 'от -40°C до +60°C'
    }
  },
  'elbow-fitting': {
    id: 'elbow-fitting',
    title: 'Отвод 90°',
    description: 'Отводы 90° для полиэтиленовых трубопроводных систем.',
    image: teeSmall, // Using the tee fitting image as placeholder
    category: 'fittings',
    features: [
      'Высокая прочность соединения',
      'Устойчивость к коррозии',
      'Простой монтаж',
      'Герметичность',
      'Долговечность'
    ],
    applications: [
      'Системы водоснабжения',
      'Газопроводы',
      'Канализационные системы',
      'Системы орошения',
      'Промышленные трубопроводы'
    ],
    specifications: {
      'Материал': 'Полиэтилен высокой плотности (ПНД)',
      'Диаметры': '20-630 мм',
      'Угол': '90°',
      'Тип соединения': 'Электросварка или стыковая сварка',
      'Стандарт': 'EN 12201, ГОСТ 18599'
    }
  },
  'elbow-45-fitting': {
    id: 'elbow-45-fitting',
    title: 'Отвод 45°',
    description: 'Отводы 45° для полиэтиленовых трубопроводных систем.',
    image: teeSmall, // Using tee image as placeholder
    category: 'fittings',
    features: [
      'Плавное изменение направления потока',
      'Минимальное гидравлическое сопротивление',
      'Устойчивость к коррозии',
      'Высокая прочность',
      'Легкость монтажа'
    ],
    applications: [
      'Системы водоснабжения',
      'Газопроводы',
      'Канализационные системы',
      'Дренажные системы',
      'Промышленные трубопроводы'
    ],
    specifications: {
      'Материал': 'Полиэтилен высокой плотности (ПНД)',
      'Диаметры': '20-630 мм',
      'Угол': '45°',
      'Тип соединения': 'Электросварка или стыковая сварка',
      'Стандарт': 'EN 12201, ГОСТ 18599'
    }
  },
  'tee-fitting': {
    id: 'tee-fitting',
    title: 'Тройник',
    description: 'Т-образные фитинги для создания ответвлений в полиэтиленовых трубопроводных системах.',
    image: teeSmall,
    category: 'fittings',
    features: [
      'Равномерное распределение потока',
      'Высокая прочность',
      'Герметичность соединений',
      'Устойчивость к коррозии',
      'Долговечность'
    ],
    applications: [
      'Системы водоснабжения',
      'Газопроводы',
      'Канализационные системы',
      'Дренажные системы',
      'Промышленные трубопроводы'
    ],
    specifications: {
      'Материал': 'Полиэтилен высокой плотности (ПНД)',
      'Диаметры': '20-630 мм',
      'Тип': 'Равнопроходной или редукционный',
      'Тип соединения': 'Электросварка или стыковая сварка',
      'Стандарт': 'EN 12201, ГОСТ 18599'
    }
  },
  'flange-adapter': {
    id: 'flange-adapter',
    title: 'Фланцевый адаптер',
    description: 'Фланцевые адаптеры для соединения полиэтиленовых труб с фланцевыми компонентами.',
    image: teeSmall, // Using tee image as placeholder
    category: 'fittings',
    features: [
      'Надежное соединение разнородных материалов',
      'Простота монтажа и демонтажа',
      'Устойчивость к коррозии',
      'Герметичность соединения',
      'Устойчивость к высокому давлению'
    ],
    applications: [
      'Соединение ПЭ труб с металлическими трубами',
      'Подключение к насосному оборудованию',
      'Подключение к запорной арматуре',
      'Промышленные трубопроводы',
      'Системы водоснабжения'
    ],
    specifications: {
      'Материал': 'Полиэтилен высокой плотности (ПНД) + сталь',
      'Диаметры': '20-630 мм',
      'Стандарт фланца': 'DIN / ANSI / ГОСТ',
      'Номинальное давление': 'PN10, PN16, PN25',
      'Тип соединения': 'Сварка / болтовое соединение'
    }
  },
  
  'rainwater-grill-meria-ru': {
    id: 'rainwater-grill-meria',
    title: 'Дождевая решетка MERIA',
    description: 'Премиальные дождевые решетки серии MERIA для современных городских ландшафтов, сочетающие функциональность с эстетической привлекательностью.',
    image: rainwaterGrillMeria,
    category: 'cast_iron',
    features: [
      'Уникальный дизайн узора MERIA',
      'Класс нагрузки D400 (40 тонн)',
      'Превосходная гидравлическая эффективность',
      'Улучшенное сопротивление скольжению',
      'Архитектурное качество отделки'
    ],
    applications: [
      'Центры городов и общественные площади',
      'Пешеходные зоны',
      'Коммерческие районы',
      'Исторические зоны',
      'Премиальные ландшафтные проекты'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG50/GJS-500-7',
      'Стандарт': 'EN 124',
      'Класс нагрузки': 'D400 (40 тонн)',
      'Покрытие': 'Премиальная битумная краска',
      'Размеры': '500×500мм (чистое отверстие)',
      'Особенности': 'Антивандальная система блокировки'
    }
  },
  
  'rainwater-grill-f900-ru': {
    id: 'rainwater-grill-f900',
    title: 'Дождевая решетка F900 сверхпрочная',
    description: 'Сверхпрочная дождевая решетка F900, разработанная для экстремальных нагрузок в промышленных и портовых условиях.',
    image: rainwaterGrillF900,
    category: 'cast_iron',
    features: [
      'Максимальная грузоподъемность F900 (90 тонн)',
      'Усиленная структурная конструкция',
      'Промышленная долговечность',
      'Высокая пропускная способность',
      'Устойчивость к экстремальным условиям'
    ],
    applications: [
      'Взлетно-посадочные полосы и рулежные дорожки аэропортов',
      'Контейнерные терминалы и порты',
      'Тяжелые промышленные зоны',
      'Логистические центры',
      'Военные объекты'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG60',
      'Стандарт': 'EN 124',
      'Класс нагрузки': 'F900 (90 тонн)',
      'Покрытие': 'Антикоррозийная краска повышенной стойкости',
      'Размеры': 'Различные промышленные размеры',
      'Установка': 'Требуется специальное высокопрочное основание'
    }
  },
  
  'ground-fire-hydrant-ru': {
    id: 'ground-fire-hydrant',
    title: 'Подземный пожарный гидрант',
    description: 'Подземная система пожарных гидрантов для эффективного доступа к воде для пожаротушения в городских и промышленных районах.',
    image: groundFireHydrant,
    category: 'cast_iron',
    features: [
      'Быстрый доступ',
      'Безопасная для движения подземная установка',
      'Защищенная от замерзания клапанная система',
      'Возможность самодренажа',
      'Стандартный интерфейс подключения'
    ],
    applications: [
      'Городские сети противопожарной защиты',
      'Промышленные комплексы',
      'Коммерческие районы',
      'Жилые комплексы',
      'Общественные объекты'
    ],
    specifications: {
      'Материал': 'Чугунный корпус',
      'Стандарт': 'EN 14339',
      'Входное соединение': 'DN80 - DN150',
      'Выходное соединение': 'Стандартные пожарные муфты',
      'Глубина установки': 'Регулируемая до линии промерзания',
      'Номинальное давление': 'PN16'
    }
  },
  
  'gate-valve-ru': {
    id: 'gate-valve',
    title: 'Задвижка чугунная',
    description: 'Задвижка с эластичным седлом для систем водоснабжения и канализации, полнопроходной конструкции для минимального ограничения потока.',
    image: gateValve,
    category: 'cast_iron',
    features: [
      'Полнопроходная конструкция для максимального потока',
      'Эластичное седло клина',
      'Невыдвижной шпиндель',
      'Уплотнение из EPDM резины',
      'Защитное эпоксидное порошковое покрытие'
    ],
    applications: [
      'Муниципальное водоснабжение',
      'Системы очистки сточных вод',
      'Промышленные водные системы',
      'Сети противопожарной защиты',
      'Ирригационные системы'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG50',
      'Стандарт': 'EN 1074-1/2, EN 1171',
      'Диапазон размеров': 'DN50 - DN500',
      'Номинальное давление': 'PN10/16',
      'Температурный диапазон': '-20°C до +70°C',
      'Соединение': 'Фланцевые концы (EN 1092-2)'
    }
  },
  
  'waste-box': {
    id: 'waste-box',
    title: 'Урна для городского мусора',
    description: 'Современная, прочная урна для сбора мусора в городских условиях с эргономичным дизайном и устойчивостью к погодным условиям.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Устойчивость к атмосферным воздействиям',
      'Эргономичный механизм открывания',
      'Система легкого опорожнения',
      'Защита от вредителей',
      'УФ-стабилизированные материалы'
    ],
    applications: [
      'Городские улицы и парки',
      'Остановки и транзитные станции',
      'Коммерческие зоны',
      'Образовательные учреждения',
      'Рекреационные объекты'
    ],
    specifications: {
      'Материал': 'Полиэтилен высокой прочности с металлическим каркасом',
      'Вместимость': '30 литров',
      'Размеры': '400×300×700мм',
      'Установка': 'Наземное или столбовое крепление',
      'Особенности': 'Гаситель для сигарет, варианты для раздельного сбора',
      'Цвет': 'Различные муниципальные варианты'
    }
  },
  
  // Steel products in Russian
  'hsaw-water-pipes': {
    id: 'hsaw-water-pipes',
    title: 'Стальные трубы HSAW для водоснабжения',
    description: 'Спиральношовные сварные стальные трубы для водопроводной инфраструктуры.',
    image: steelPipesOilGas, // Using steel pipes image as placeholder
    category: 'steel',
    features: [
      'Высокая прочность и надежность',
      'Устойчивость к высокому давлению',
      'Большие диаметры для магистральных водопроводов',
      'Долговечность и износостойкость',
      'Антикоррозийное покрытие'
    ],
    applications: [
      'Магистральные водопроводы',
      'Городские сети водоснабжения',
      'Ирригационные системы',
      'Промышленное водоснабжение',
      'Системы пожаротушения'
    ],
    specifications: {
      'Тип': 'Спиральношовная сварная труба (HSAW)',
      'Стандарт': 'EN 10224, ГОСТ 10704',
      'Диаметр': '300-2500 мм',
      'Толщина стенки': '5-25 мм',
      'Покрытие': 'Эпоксидное, полиэтиленовое, цементно-песчаное',
      'Длина': '6-18 м'
    }
  },
  'steel-pipes-oil-gas': {
    id: 'steel-pipes-oil-gas',
    title: 'Трубы для нефти и газа',
    description: 'Стальные трубы высокого давления, специально разработанные для транспортировки нефти и газа.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Устойчивость к экстремально высокому давлению',
      'Высокая прочность и надежность',
      'Специальные марки стали для нефтегазовой отрасли',
      'Устойчивость к коррозии и агрессивным средам',
      'Жесткий контроль качества и сертификация'
    ],
    applications: [
      'Магистральные нефтепроводы',
      'Магистральные газопроводы',
      'Внутрипромысловые трубопроводы',
      'Распределительные газовые сети',
      'Нефтеперерабатывающие заводы'
    ],
    specifications: {
      'Тип': 'Бесшовные или сварные',
      'Стандарт': 'API 5L, ГОСТ 31447',
      'Класс прочности': 'L245 - L555 (X42 - X80)',
      'Диаметр': '21.3-1422 мм',
      'Толщина стенки': '2.8-42 мм',
      'Покрытие': '3-слойное полиэтиленовое, эпоксидное'
    }
  },
  'pile-pipes': {
    id: 'pile-pipes',
    title: 'Сваи стальные',
    description: 'Структурные стальные трубы, используемые для фундаментных свай в строительных проектах.',
    image: steelPipesOilGas, // Using steel pipes image as placeholder
    category: 'steel',
    features: [
      'Высокая несущая способность',
      'Быстрая установка',
      'Возможность погружения в сложных грунтах',
      'Устойчивость к коррозии при правильной обработке',
      'Возможность использования в качестве несущих элементов'
    ],
    applications: [
      'Глубокие фундаменты зданий',
      'Мостовые опоры',
      'Портовые сооружения',
      'Офшорные конструкции',
      'Подпорные стены'
    ],
    specifications: {
      'Тип': 'Прямошовные или спиральношовные',
      'Диаметр': '168-2020 мм',
      'Толщина стенки': '8-20 мм',
      'Длина': 'До 24 м (стандартная) или по заказу',
      'Защита от коррозии': 'Горячее цинкование, эпоксидное покрытие',
      'Форма конца': 'Открытый, закрытый, с наконечником'
    }
  },
  
  // Aluminum products in Russian
  'structural-aluminum': {
    id: 'structural-aluminum',
    title: 'Структурный алюминий',
    description: 'Высокопрочные алюминиевые профили, разработанные для структурных применений в строительстве и промышленных секторах.',
    image: standardProfiles, // Using high-quality aluminum u-profiles image
    category: 'aluminum',
    features: [
      'Высокое соотношение прочности к весу',
      'Отличная коррозионная стойкость',
      'Размерная стабильность',
      'Хорошая теплопроводность',
      'Немагнитные свойства'
    ],
    applications: [
      'Промышленные рамы и конструкции',
      'Строительные каркасы',
      'Модульные строительные системы',
      'Коммерческие конструкции',
      'Инфраструктурные проекты'
    ],
    specifications: {
      'Тип сплава': '6000 серия (6061, 6063, 6082)',
      'Закалка': 'T5, T6',
      'Предел текучести': '240-260 МПа',
      'Предел прочности': '290-310 МПа',
      'Обработка поверхности': 'Заводская отделка, анодирование, порошковое покрытие'
    }
  },
  'architectural-aluminum': {
    id: 'architectural-aluminum',
    title: 'Архитектурный алюминий',
    description: 'Премиальные алюминиевые профили для фасадов, окон и декоративных архитектурных элементов.',
    image: tProfiles, // Using aluminum t-profiles image for architectural profiles
    category: 'aluminum',
    features: [
      'Эстетически привлекательный внешний вид',
      'Широкий выбор отделки и цветов',
      'Устойчивость к погодным условиям',
      'Долговечность и низкие требования к обслуживанию',
      'Превосходные возможности формования'
    ],
    applications: [
      'Фасадные системы',
      'Оконные и дверные рамы',
      'Декоративные элементы здания',
      'Солнцезащитные экраны и жалюзи',
      'Внутренние перегородки'
    ],
    specifications: {
      'Тип сплава': '6000 серия (преимущественно 6063)',
      'Закалка': 'T5, T6',
      'Варианты отделки': 'Анодирование, порошковое покрытие, имитация дерева',
      'Цветовые опции': 'По каталогу RAL',
      'Толщина стенки': '1.2-3.0 мм'
    }
  },
  'industrial-aluminum': {
    id: 'industrial-aluminum',
    title: 'Промышленный алюминий',
    description: 'Специализированные алюминиевые профили для производства, компонентов машин и промышленных применений.',
    image: ledProfiles, // Using LED profiles image which shows industrial application
    category: 'aluminum',
    features: [
      'Высокая точность размеров',
      'Отличная обрабатываемость',
      'Конструктивная гибкость',
      'Устойчивость к экстремальным условиям',
      'Хорошая электропроводность'
    ],
    applications: [
      'Автоматизированное оборудование',
      'Конвейерные системы',
      'Промышленные рамы',
      'Электрические корпуса',
      'Радиаторы и теплообменники'
    ],
    specifications: {
      'Тип сплава': '6000 и 7000 серии',
      'Допуски': 'Соответствие DIN/ISO стандартам',
      'Обработка поверхности': 'Анодирование, пассивация',
      'Методы соединения': 'Т-образные пазы, фитинги и соединители',
      'Модульность': 'Совместимость с промышленными стандартами'
    }
  },
  'custom-aluminum': {
    id: 'custom-aluminum',
    title: 'Индивидуальные решения',
    description: 'Индивидуальные алюминиевые профильные решения, разработанные для удовлетворения конкретных требований проекта.',
    image: specialProfiles, // Using special aluminum profile image showing custom extrusions
    category: 'aluminum',
    features: [
      'Проектирование по спецификациям клиента',
      'Оптимизация формы для конкретного применения',
      'Специальные сплавы для особых требований',
      'Индивидуальные механические свойства',
      'Нестандартные размеры и формы'
    ],
    applications: [
      'Специализированное транспортное оборудование',
      'Уникальные строительные элементы',
      'Аэрокосмические компоненты',
      'Морские применения',
      'Специальные промышленные машины'
    ],
    specifications: {
      'Тип сплава': 'Подбирается в соответствии с требованиями',
      'Производственный процесс': 'Экструзия с ЧПУ, фрезерование, прецизионная обработка',
      'Документация': 'Полная техническая документация и сертификаты',
      'Прототипирование': 'Быстрое прототипирование доступно',
      'Минимальный заказ': 'Гибкие условия для специальных проектов'
    }
  },
  
  // Rainwater products in Russian
  'rainwater-grill-d400-standard': {
    id: 'rainwater-grill-d400-standard',
    title: 'Дождеприемник D400',
    description: 'Высокопрочный дождеприемник D400, разработанный для водоотведения в зонах с интенсивным движением, таких как дороги и коммерческие зоны.',
    image: rainwaterGrillD400,
    category: 'cast_iron',
    features: [
      'Конструкция из высокопрочного чугуна',
      'Класс нагрузки D400 (40 тонн)',
      'Оптимизированная конструкция водотока',
      'Противозасорный рисунок',
      'Варианты безопасной установки'
    ],
    applications: [
      'Системы дорожного водоотведения',
      'Городская инфраструктура',
      'Коммерческие парковки',
      'Промышленные объекты',
      'Общественные пространства'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG50/GJS-500-7',
      'Стандарт': 'EN 124',
      'Класс нагрузки': 'D400 (40 тонн)',
      'Покрытие': 'Черная битумная краска',
      'Размеры': 'Доступны различные модели',
      'Опции': 'Шарнирные или нешарнирные версии'
    }
  },
  'rainwater-grill-d400-type2': {
    id: 'rainwater-grill-d400-type2',
    title: 'Дождеприемник D400 Тип 2',
    description: 'Альтернативная конструкция дождеприемника D400 с улучшенными характеристиками потока для водоотвода в городской среде.',
    image: rainwaterGrillD4002,
    category: 'cast_iron',
    features: [
      'Улучшенная конструкция водотока',
      'Класс нагрузки D400 (40 тонн)',
      'Усовершенствованная противозасорная геометрия',
      'Малошумная конструкция',
      'Оптимизирован для дренажа высокой пропускной способности'
    ],
    applications: [
      'Дренажные системы в центре города',
      'Коммерческие зоны',
      'Парковочные сооружения',
      'Пешеходные зоны с доступом транспорта',
      'Маршруты общественного транспорта'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG50/GJS-500-7',
      'Стандарт': 'EN 124',
      'Класс нагрузки': 'D400 (40 тонн)',
      'Покрытие': 'Черная битумная краска',
      'Размеры': '500×500мм (чистое отверстие)',
      'Особенности': 'Эргономичные точки подъема'
    }
  },
  'hdpe-pipes-ru': {
    id: 'hdpe-pipes',
    title: 'Трубы ПНД (PE100)',
    description: 'Трубы из полиэтилена высокой плотности с отличной химической стойкостью для систем водоснабжения, газа и канализации.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Высокая химическая стойкость',
      'Длительный срок службы (более 50 лет)',
      'Отличная устойчивость к растрескиванию',
      'Хорошая стойкость к истиранию',
      'Гибкость и легкость'
    ],
    applications: [
      'Системы питьевого водоснабжения',
      'Газораспределительные сети',
      'Промышленный транспорт жидкостей',
      'Канализационные системы',
      'Сельскохозяйственное орошение'
    ],
    specifications: {
      'Материал': 'PE100 (полиэтилен высокой плотности)',
      'Стандарт': 'EN 12201, ISO 4427',
      'Диаметры': 'от 20мм до 1200мм',
      'Классы давления': 'от PN4 до PN25',
      'Цвет': 'Черный с синими полосами (вода) или желтыми полосами (газ)',
      'Соединение': 'Стыковая сварка, электросварка или механические соединения'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: 'Люки и Рамы',
    description: 'Тяжелые чугунные люки и рамы для городской инфраструктуры с различными классами нагрузки.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Прочная чугунная конструкция',
      'Различные классы нагрузки (от A15 до F900)',
      'Противоугонная конструкция',
      'Опциональные системы блокировки',
      'Настраиваемые поверхностные узоры'
    ],
    applications: [
      'Дорожная инфраструктура',
      'Пешеходные зоны',
      'Коммерческие зоны',
      'Промышленные объекты',
      'Городские дренажные системы'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG50/GJS-500-7',
      'Стандарт': 'EN 124',
      'Классы нагрузки': 'D400 (40 тонн)',
      'Покрытие': 'Черная битумная краска на водной основе',
      'Проем': 'Чистый проем зависит от модели',
      'Установка': 'Монтаж в бетон или асфальт'
    }
  },
  'rainwater-grill-meria': {
    id: 'rainwater-grill-meria',
    title: 'Дождеприемник D400 MERIA',
    description: 'Дождеприемник серии MERIA с центральной точкой доступа для улучшенного обслуживания и удаления отложений.',
    image: rainwaterGrillMeria,
    category: 'cast_iron',
    features: [
      'Центральная конструкция доступа для обслуживания',
      'Класс нагрузки D400',
      'Превосходное управление отложениями',
      'Противоугонная система блокировки',
      'Сниженная частота обслуживания'
    ],
    applications: [
      'Городские дренажные системы',
      'Зоны, требующие частой очистки',
      'Места с высокой нагрузкой по отложениям',
      'Коммерческие и городские центры',
      'Зоны со строгими правилами обслуживания'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG50',
      'Стандарт': 'EN 124',
      'Класс нагрузки': 'D400 (40 тонн)',
      'Покрытие': 'Битумная краска на водной основе',
      'Точка доступа': 'Центральный люк со специальным ключом',
      'Установка': 'Монтаж в бетонную раму'
    }
  },
  'rainwater-grill-f900': {
    id: 'rainwater-grill-f900',
    title: 'Дождеприемник F900',
    description: 'Сверхпрочный дождеприемник класса F900 для экстремальных условий нагрузки, таких как аэропорты, доки и промышленные зоны.',
    image: rainwaterGrillF900,
    category: 'cast_iron',
    features: [
      'Сверхпрочная конструкция из высокопрочного чугуна',
      'Класс нагрузки F900 (90 тонн)',
      'Максимальная устойчивость к деформации',
      'Специальная конструкция для экстремальных условий',
      'Усиленная рама и улучшенная установка'
    ],
    applications: [
      'Аэропорты и взлетно-посадочные полосы',
      'Портовые и доковые сооружения',
      'Тяжелая промышленность',
      'Логистические терминалы',
      'Зоны с экстремальными нагрузками'
    ],
    specifications: {
      'Материал': 'Высокопрочный чугун GGG50/GJS-500-7',
      'Стандарт': 'EN 124',
      'Класс нагрузки': 'F900 (90 тонн)',
      'Покрытие': 'Специальная антикоррозийная краска',
      'Размеры': 'Стандартизированы согласно требованиям',
      'Особенности': 'Улучшенная фиксация и противоскольжение'
    }
  },
  'steel-pipes-oil-gas-ru': {
    id: 'steel-pipes-oil-gas',
    title: 'Стальные трубы для нефти и газа',
    description: 'Высокопрочные стальные трубы для транспортировки нефти, газа и нефтепродуктов, устойчивые к коррозии и высокому давлению.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Превосходная прочность и долговечность',
      'Устойчивость к высокому давлению',
      'Защита от коррозии',
      'Соответствие международным стандартам',
      'Различные методы соединения'
    ],
    applications: [
      'Нефтегазовые трубопроводы',
      'Нефтеперерабатывающие заводы',
      'Добыча и переработка',
      'Морские платформы',
      'Транспортировка промышленных жидкостей'
    ],
    specifications: {
      'Материал': 'Высококачественная сталь',
      'Стандарты': 'API 5L, ASTM A53/A106',
      'Диаметры': 'от 60.3мм до 1220мм',
      'Толщина стенки': 'от 4мм до 40мм',
      'Соединение': 'Сварка встык, резьбовое, фланцевое',
      'Покрытие': 'FBE, 3PE, внутреннее эпоксидное покрытие'
    }
  },
  'gate-valve-lt': {
    id: 'gate-valve',
    title: 'Задвижка чугунная',
    description: 'Чугунные задвижки для систем водоснабжения и промышленного применения с превосходным уплотнением и длительным сроком службы.',
    image: gateValve,
    category: 'valves',
    features: [
      'Прочная чугунная конструкция',
      'Классы давления PN10-16',
      'Простое управление и обслуживание',
      'Полное перекрытие потока',
      'Длительный срок службы'
    ],
    applications: [
      'Системы водоснабжения',
      'Водоочистные сооружения',
      'Промышленные процессы',
      'Распределительные сети',
      'Пожарные системы'
    ],
    specifications: {
      'Материал корпуса': 'Чугун GG25/GJL-250',
      'Материал штока': 'Нержавеющая сталь',
      'Рабочее давление': 'PN10-16',
      'Размеры': 'DN50-500',
      'Температура': 'от -10°C до +120°C',
      'Управление': 'Ручное с возможностью электропривода'
    }
  },
  'ground-fire-hydrant': {
    id: 'ground-fire-hydrant',
    title: 'Наземный пожарный гидрант',
    description: 'Надежные наземные пожарные гидранты для быстрого доступа к источникам воды при чрезвычайных ситуациях.',
    image: groundFireHydrant,
    category: 'fire-protection',
    features: [
      'Высокая прочность и надежность',
      'Быстрое срабатывание',
      'Защита от замерзания',
      'Соответствие противопожарным нормам',
      'Возможность дренажа'
    ],
    applications: [
      'Городская противопожарная инфраструктура',
      'Промышленные объекты',
      'Торговые центры',
      'Жилые комплексы',
      'Аэропорты и транспортные терминалы'
    ],
    specifications: {
      'Материал': 'Чугун с защитным покрытием',
      'Подключение': 'Фланцевое DN80-100',
      'Рабочее давление': 'PN16',
      'Выходы': '2-3 выхода (Storz)',
      'Высота': '750-1500мм',
      'Активация': 'Ключ гидранта'
    }
  }
};

// Estonian language product details
const etProductDetailsMap: Record<string, ProductDetails> = {
  // Aluminum products in Estonian
  
  // Add missing category entries for Estonian
  
  // Missing fitting products for Estonian
  'corrugated-pipes': {
    id: 'corrugated-pipes',
    title: 'Topeltseintega gofreeritud torud',
    description: 'Topeltseintega gofreeritud torud sileda sisepinnaga vee ärajuhtimise ja kanalisatsioonisüsteemidele.',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      'Kõrge vastupidavus deformatsioonile',
      'Suurepärased hüdraulilised omadused',
      'Lihtne paigaldamine',
      'Pikk kasutusiga'
    ],
    applications: [
      'Vihmavee kollektorid',
      'Kanalisatsioonisüsteemid',
      'Drenaažisüsteemid',
      'Teedeehitus'
    ]
  },
  'reinforced-pipe': {
    id: 'reinforced-pipe',
    title: 'Terasega tugevdatud PE torud',
    description: 'Terasega tugevdatud polüetüleentorud suurtele koormustele ja ekstreemsetele tingimustele.',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      'Tugev konstruktsioon terastugevdusega',
      'Kõrge surve taluvus',
      'Deformatsioonikindlus',
      'Keemiline vastupidavus'
    ],
    applications: [
      'Suure läbimõõduga torustikud',
      'Maa-alused paigaldused',
      'Tööstuslikud süsteemid',
      'Suure koormusega keskkonnad'
    ]
  },
  'elbow-fitting': {
    id: 'elbow-fitting',
    title: '90° põlv',
    description: 'HDPE 90° põlv torustiku suuna muutmiseks optimaalse voolujõudlusega.',
    image: elbow90,
    category: 'fittings',
    features: [
      'Ühtne konstruktsioon',
      'Lihtne paigaldus',
      'Vastupidav materjal',
      'Erinevad suurused'
    ],
    applications: [
      'Veejaotussüsteemid',
      'Heitveesüsteemid',
      'Tööstuslikud paigaldused',
      'Kommunaalteenused'
    ]
  },
  'elbow-45-fitting': {
    id: 'elbow-45-fitting',
    title: '45° põlv',
    description: 'HDPE 45° põlv torustiku suuna lihtsaks muutmiseks minimaalse voolutakistusega.',
    image: elbow45,
    category: 'fittings',
    features: [
      'Optimaalne vooludünaamika',
      'Usaldusväärne ühendus',
      'Pikaajaline materjal',
      'Ühilduv standardsete torudega'
    ],
    applications: [
      'Kanalisatsioonisüsteemid',
      'Veevarustussüsteemid',
      'Tööstuslikud süsteemid',
      'Infrastruktuuriprojektid'
    ]
  },
  'tee-fitting': {
    id: 'tee-fitting',
    title: 'T-liitmik',
    description: 'HDPE T-liitmik haruühenduste loomiseks torustikusüsteemides suurepärase konstruktsiooni terviklikkusega.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Kolme toru ühendamine',
      'Optimaalne voolu jaotus',
      'Kõrgkvaliteetne materjal',
      'Saadaval erinevad suurused'
    ],
    applications: [
      'Veevarustussüsteemid',
      'Kanalisatsioonivõrgud',
      'Tööstuslikud torustikud',
      'Heitveesüsteemid'
    ]
  },
  'flange-adapter': {
    id: 'flange-adapter',
    title: 'Äärikadapter',
    description: 'HDPE äärikadapter erinevate torustikusüsteemide ühendamiseks usaldusväärse hermeetilise tihendusega.',
    image: flangeAdapterShort,
    category: 'fittings',
    features: [
      'Universaalne ühilduvus',
      'Veekindel ühendus',
      'Korrosioonikindel',
      'Lihtne paigaldamine'
    ],
    applications: [
      'Erinevate süsteemide integreerimine',
      'Remont ja hooldus',
      'Tööstuslikud paigaldused',
      'Veevarustussüsteemid'
    ]
  },
  'hsaw-water-pipes': {
    id: 'hsaw-water-pipes',
    title: 'HSAW torud veevarustusele',
    description: 'Spiraalkeevitusega terastorud vee transportimiseks suurepärase surve taluvuse ja pika kasutuseaga.',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      'Kõrge survekindlus',
      'Spiraalkeevitusega konstruktsioon',
      'Korrosioonikaitse',
      'Suur läbimõõt'
    ],
    applications: [
      'Vee magistraalid',
      'Ülekandetorustikud',
      'Infrastruktuuriprojektid',
      'Munitsipaalveevarustus'
    ]
  },
  'polyethylene': {
    id: 'polyethylene',
    title: 'Polüetüleentooted',
    description: 'Kõrgkvaliteetsed polüetüleentorud ja liitmikud vee- ja heitveesüsteemidele.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Kerge ja vastupidav',
      'Korrosioonikindel',
      'Paindlik kasutus',
      'Pikaajaline vastupidavus'
    ],
    applications: [
      'Veevarustus',
      'Heitveesüsteemid',
      'Drenaažisüsteemid',
      'Tööstuslikud võrgustikud'
    ]
  },
  'fittings': {
    id: 'fittings',
    title: 'Liitmikud',
    description: 'Erinevad liitmikud torustikusüsteemide ühendamiseks ja konfigureerimiseks.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Kõrgkvaliteetsed materjalid',
      'Erinevad konfiguratsioonid',
      'Usaldusväärsed tihendid',
      'Lihtne paigaldamine'
    ],
    applications: [
      'Veevarustussüsteemid',
      'Heitveesüsteemid',
      'Tööstuslikud torustikud',
      'Kommunaalvõrgud'
    ]
  },
  'steel': {
    id: 'steel',
    title: 'Terastooted',
    description: 'Kõrgkvaliteetsed terastorud ja komponendid erinevateks rakendusteks.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Suur tugevus',
      'Kõrge temperatuuritaluvus',
      'Pikaajaline vastupidavus',
      'Vastupidavus suurtele koormustele'
    ],
    applications: [
      'Nafta- ja gaasitööstus',
      'Vee transport',
      'Ehituslikud elemendid',
      'Tööstuslikud torustikud'
    ]
  },
  'cast-iron': {
    id: 'cast-iron',
    title: 'Malmist Tooted',
    description: 'Laialdane malmist toodete valik infrastruktuuri ja ehituse jaoks pikaajalise vastupidavusega.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Suur vastupidavus ja tugevus',
      'Korrosioonikindlus',
      'Pikk eluiga',
      'Vastavus Euroopa standarditele'
    ],
    applications: [
      'Linnainfrastruktuur',
      'Veevarustussüsteemid',
      'Kanalisatsioonisüsteemid',
      'Teedeehitus'
    ]
  },
  'aluminum': {
    id: 'aluminum',
    title: 'Alumiiniumtooted',
    description: 'Kvaliteetsed alumiiniumtooted erinevatele tööstuslikele ja kaubanduslikele vajadustele.',
    image: standardProfiles,
    category: 'aluminum',
    features: [
      'Kerge ja tugev konstruktsioon',
      'Korrosioonikindlus',
      'Erinevad vormid ja suurused',
      'Keskkonnasõbralik materjal'
    ],
    applications: [
      'Ehitus',
      'Transpordisektor',
      'Tööstuslikud rakendused',
      'Arhitektuur ja disain'
    ]
  },
  'urban-infrastructure': {
    id: 'urban-infrastructure',
    title: 'Linnainfrastruktuuri Lahendused',
    description: 'Linnainfrastruktuuri lahendused keskendudes jätkusuutlikkusele ja funktsionaalsusele.',
    image: wellFacility,
    category: 'urban_infrastructure',
    features: [
      'Jätkusuutlikud materjalid',
      'Integreeritud lahendused',
      'Kaasaegse disaini elemendid',
      'Lihtne paigaldamine ja hooldus'
    ],
    applications: [
      'Pargid ja puhkealad',
      'Linnakeskused',
      'Avalikud alad',
      'Transpordiinfrastruktuur'
    ]
  },
  'drainage-channel': {
    id: 'drainage-channel',
    title: 'Äravoolukanalid',
    description: 'Suure vastupidavusega äravoolukanalid tõhusaks vee ärajuhtimiseks linna- ja tööstuspiirkondades.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Suur koormuskindlus',
      'Tõhus vee ärajuhtimine',
      'Lihtne paigaldamine',
      'Kerge hooldus ja puhastamine'
    ],
    applications: [
      'Tänavad ja teed',
      'Parkimisalad',
      'Tööstuspiirkonnad',
      'Avalikud alad'
    ]
  },
  'standard-profiles': {
    id: 'standard-profiles',
    title: 'Standardsed alumiiniumprofiilid',
    description: 'Standardsed alumiiniumprofiilid mitmekülgseks kasutamiseks ehituses, tehnikas ja disainis erinevate kujude ja suurustega.',
    image: standardProfiles,
    category: 'alumiinium',
    features: [
      'Lai valik standardseid kujusid',
      'Saadaval mitmes mõõtmes',
      'Kõrgekvaliteetne viimistlus',
      'Suurepärane tugevuse ja kaalu suhe',
      'Kulutõhusad lahendused'
    ],
    applications: [
      'Mööbli tootmine',
      'Interjööri disainelemendid',
      'Näituste süsteemid',
      'Üldine ehitus',
      'Dekoratiivsed elemendid'
    ],
    specifications: {
      'Materjal': 'Alumiiniumsulam EN AW-6060, EN AW-6063',
      'Sulami seisund': 'T5, T6',
      'Pinna viimistlus': 'Töötlemata, anodeeritud, pulberkattega',
      'Standardpikkus': '6000 mm (±10 mm)',
      'Tootmismeetod': 'Kuumekstrusioon'
    }
  },
  
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: 'Masinaehituse profiilid',
    description: 'Spetsialiseeritud alumiiniumprofiilid tööstuslikeks ja masinaehituse rakendusteks, suurendatud täpsuse ja tugevusega.',
    image: machineProfiles,
    category: 'alumiinium',
    features: [
      'Kõrge dimensionaalne täpsus',
      'Suurepärane stabiilsus',
      'Modulaarse ühenduse võimalus',
      'Soontega konstruktsioonid lihtsaks kokkupanekuks',
      'Ühilduvus tööstuslike kinnitussüsteemidega'
    ],
    applications: [
      'Masinad ja seadmed',
      'Automatiseeritud süsteemid',
      'Tööstuslikud raamid',
      'Tootmisliinid',
      'Robootika'
    ],
    specifications: {
      'Materjal': 'Alumiiniumsulam EN AW-6063, EN AW-6082',
      'Sulami seisund': 'T5, T6',
      'Täpsus': 'Kõrgem kui standardsetel profiilidel',
      'Mõõtmete vahemik': '20x20 mm kuni 80x80 mm',
      'Omadused': 'Erinevad soone süsteemid (sh T-sooned)'
    }
  },
  
  'led-profiles': {
    id: 'led-profiles',
    title: 'LED valgustuse profiilid',
    description: 'Spetsiaalsed alumiiniumprofiilid LED-ribade paigaldamiseks ja integreeritud valgustussüsteemide loomiseks.',
    image: ledProfiles,
    category: 'alumiinium',
    features: [
      'Valikulised difuusorid ja läätsed',
      'Integreeritud juhtmekanalid',
      'Tõhus soojusjuhtimine',
      'Peidetud paigaldus',
      'Erinevad paigaldusvõimalused'
    ],
    applications: [
      'Koduvalgusti',
      'Äriline valgustus',
      'Mööbli valgustus',
      'Arhitektuuriline valgustus',
      'Dekoratiivsed valgusaksendid'
    ],
    specifications: {
      'Materjal': 'Alumiiniumsulam EN AW-6063',
      'Pind': 'Anodeeritud, värvitud, töötlemata',
      'Ühilduvus': 'Standardsed LED-ribad laiusega 8-15 mm',
      'Valikulised tarvikud': 'Otsikud, klambrid, difuusorid, läätsed',
      'Saadaval värvid': 'Hõbedane, valge, must, pruun'
    }
  },
  
  'special-profiles': {
    id: 'special-profiles',
    title: 'Spetsiaalsed alumiiniumprofiilid',
    description: 'Alumiiniumprofiilid ebastandardse geomeetria ja mõõtmetega konkreetsete tööstusharude ja spetsialiseeritud rakenduste jaoks.',
    image: specialProfiles,
    category: 'alumiinium',
    features: [
      'Kohandatud disain',
      'Spetsialiseeritud funktsionaalsus',
      'Mitmesugused viimistlusvõimalused',
      'Integreeritud süsteemsed lahendused',
      'Väikeste partiide tootmise võimalus'
    ],
    applications: [
      'Transporditööstus',
      'Taastuvenergia',
      'Soojusvahetid',
      'Radiaatorid ja jahutus',
      'Kohandatud ehitussüsteemid'
    ],
    specifications: {
      'Materjal': 'Erinevate seeriate alumiiniumsulamid',
      'Disain': 'Vastavalt kliendi spetsifikatsioonile või tööstusstandardi järgi',
      'Viimistlus': 'Vastavalt rakenduse nõuetele',
      'Pikkus': 'Standardselt 6m või vastavalt spetsifikatsioonile',
      'Minimaalne tellimus': 'Sõltub profiili keerukusest'
    }
  },
  'structural-aluminum': {
    id: 'structural-aluminum',
    title: 'Konstruktsiooni alumiinium',
    description: 'Kõrge tugevusega alumiiniumprofiilid, mis on loodud ehitus- ja tööstussektorites kasutamiseks.',
    image: standardProfiles, // Using aluminum u-profiles image
    category: 'aluminum',
    features: [
      'Kõrge tugevuse ja kaalu suhe',
      'Suurepärane korrosioonikindlus',
      'Mõõtmete stabiilsus',
      'Hea soojusjuhtivus',
      'Mittemagnetilised omadused'
    ],
    applications: [
      'Tööstuslikud raamid ja konstruktsioonid',
      'Ehitusraamistikud',
      'Moodulehitussüsteemid',
      'Kommertskonstruktsioonid',
      'Taristuprojektid'
    ],
    specifications: {
      'Sulami tüüp': '6000 seeria (6061, 6063, 6082)',
      'Karastus': 'T5, T6',
      'Voolavuspiir': '240-260 MPa',
      'Tõmbetugevus': '290-310 MPa',
      'Pinnatöötlus': 'Tehasetöötlus, anodeerimine, pulberkate'
    }
  },
  'architectural-aluminum': {
    id: 'architectural-aluminum',
    title: 'Arhitektuuriline alumiinium',
    description: 'Kvaliteetsed alumiiniumprofiilid fassaadidele, akendele ja dekoratiivsetele arhitektuurielementidele.',
    image: tProfiles, // Using aluminum t-profiles image
    category: 'aluminum',
    features: [
      'Esteetiliselt meeldiv välimus',
      'Lai valik viimistlusi ja värve',
      'Ilmastikukindlus',
      'Vastupidavus ja väike hooldusvajadus',
      'Suurepärased vormimise võimalused'
    ],
    applications: [
      'Fassaadisüsteemid',
      'Akna- ja uksraamid',
      'Ehitiste dekoratiivelemendid',
      'Päikesevarjud ja žalusiid',
      'Sisemised vaheseinad'
    ],
    specifications: {
      'Sulami tüüp': '6000 seeria (peamiselt 6063)',
      'Karastus': 'T5, T6',
      'Viimistluse valikud': 'Anodeerimine, pulberkate, puitimitatsioon',
      'Värvivalikud': 'RAL kataloogi järgi',
      'Seinapaksus': '1.2-3.0 mm'
    }
  },
  'industrial-aluminum': {
    id: 'industrial-aluminum',
    title: 'Tööstuslik alumiinium',
    description: 'Spetsialiseeritud alumiiniumprofiilid tootmiseks, masinakomponentideks ja tööstuslikeks rakendusteks.',
    image: ledProfiles, // Using LED profiles image for industrial applications
    category: 'aluminum',
    features: [
      'Täpne mõõtmeline täpsus',
      'Suurepärane töödeldavus',
      'Konstruktsiooniline paindlikkus',
      'Vastupidavus ekstreemsetele tingimustele',
      'Hea elektrijuhtivus'
    ],
    applications: [
      'Automatiseeritud seadmed',
      'Konveiersüsteemid',
      'Tööstuslikud raamid',
      'Elektrikorpused',
      'Radiaatorid ja soojusvahetid'
    ],
    specifications: {
      'Sulami tüüp': '6000 ja 7000 seeriad',
      'Tolerantsid': 'Vastavus DIN/ISO standarditele',
      'Pinnatöötlus': 'Anodeerimine, passivatsioon',
      'Ühendusmeetodid': 'T-sooned, tarvikud ja ühendused',
      'Modulaarsus': 'Ühilduvus tööstusstandartidega'
    }
  },
  'custom-aluminum': {
    id: 'custom-aluminum',
    title: 'Kohandatud lahendused',
    description: 'Kohandatud alumiiniumprofiilide lahendused, mis on loodud vastama konkreetsetele projekti nõuetele.',
    image: specialProfiles, // Using special aluminum profile image showing custom extrusions
    category: 'aluminum',
    features: [
      'Projekteerimine vastavalt kliendi spetsifikatsioonidele',
      'Vormi optimeerimine konkreetse kasutuse jaoks',
      'Spetsiaalsed sulamid erinõuete jaoks',
      'Kohandatud mehaanilised omadused',
      'Ebastandardsed mõõtmed ja vormid'
    ],
    applications: [
      'Spetsialiseeritud transpordivarustus',
      'Unikaalsed ehituselemendid',
      'Kosmoserakendused',
      'Mererakendused',
      'Spetsiaalsed tööstusmasinad'
    ],
    specifications: {
      'Sulami tüüp': 'Vastavalt nõuetele valitud',
      'Tootmisprotsess': 'CNC ekstrusioon, freesimine, täppistöötlemine',
      'Dokumentatsioon': 'Täielik tehniline dokumentatsioon ja sertifikaadid',
      'Prototüüpimine': 'Kiire prototüüpimine saadaval',
      'Minimaalne tellimus': 'Paindlikud tingimused erikontseptsioonide jaoks'
    }
  },
  
  // Infrastructure products translations - Estonian
  'rainwater-grill-d400': {
    id: 'rainwater-grill-d400',
    title: 'Vihmavee rest D400',
    description: 'Tugevast malmist D400 vihmavee rest, mis on mõeldud sademevee ärajuhtimiseks intensiivse liiklusega aladel.',
    image: 'Rainwater grill D400 1 .png',
    category: 'cast_iron',
    features: [
      'Kõrge koormustaluvus kuni D400 (40 tonni)',
      'Sõiduteele sobiv disain',
      'Libisemisvastane pind',
      'Lihtne paigaldada ja hooldada'
    ],
    applications: [
      'Tänavad ja teed',
      'Parklad',
      'Kommerts- ja tööstusobjektid',
      'Linnakeskkonnad'
    ],
    specifications: {
      'Materjal': 'Malmist raam ja rest',
      'Koormusklassifikatsioon': 'D400 vastavalt EN 124',
      'Mõõtmed': '600 x 600 mm (standardsuurus)',
      'Pinnakate': 'Must asfalt või pulberkattega'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: 'Kanalisatsioonikaevud ja raamid',
    description: 'Rasked malmist kanalisatsioonikaevude kaaned ja raamid linnainfrastruktuuri jaoks erinevate koormuskindlusklassidega.',
    image: 'Circular manhole cover (С250)K H80 .png',
    category: 'cast_iron',
    features: [
      'Saadaval erinevad koormusklassid: B125, C250, D400',
      'Hingega või ilma hingedeta disain',
      'Lukustusmehhanism turvalisuse tagamiseks',
      'Müravastane disain'
    ],
    applications: [
      'Tänavad ja teed',
      'Kõnniteed',
      'Jalakäijate alad',
      'Kanalisatsioonisüsteemid'
    ],
    specifications: {
      'Materjal': 'Kvaliteetne hall malm',
      'Koormusklassifikatsioon': 'B125 kuni D400',
      'Läbimõõt': '600mm, 800mm, 1000mm (standardsuurused)',
      'Kõrgus': '80mm kuni 150mm, sõltuvalt klassist'
    }
  },
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: 'HDPE torud (PE100)',
    description: 'Kõrge tihedusega polüetüleentorud vee-, gaasi- ja kanalisatsioonisüsteemidele.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Suurepärane keemiline vastupidavus',
      'Pikk kasutusiga (50+ aastat)',
      'Paindlikud ja kergekaalulised',
      'Korrosioonikindlad',
      'Madalad hoolduskulud'
    ],
    applications: [
      'Joogivee transport',
      'Kanalisatsioonisüsteemid',
      'Gaasitorustikud',
      'Tööstuslikud vedelike transportimine',
      'Maaparandussüsteemid'
    ],
    specifications: {
      'Materjal': 'PE100 kõrge tihedusega polüetüleen',
      'Standardid': 'EN 12201, ISO 4427',
      'Läbimõõdud': '20mm kuni 2000mm',
      'Rõhuklass': 'PN6.3 kuni PN25',
      'Ühendused': 'Elektrofusioon, põkkkeevitus, mehaanilised liitmikud'
    }
  },
  'gate-valve-et': {
    id: 'gate-valve',
    title: 'Lüüsiventiil',
    description: 'Malmist lüüsiventiilid veevarustus- ja tööstusvaldkonna jaoks suurepärase tihendusvõimega ja pika kasutusajaga.',
    image: gateValve,
    category: 'valves',
    features: [
      'Täielik läbilaskmine avatud asendis',
      'Madal rõhukadu',
      'Pikaajaline tihendusvõime',
      'Kahesuunaline voolukontroll'
    ],
    applications: [
      'Veevarustussüsteemid',
      'Kanalisatsioonisüsteemid',
      'Tööstuslikud süsteemid',
      'Niisutussüsteemid'
    ],
    specifications: {
      'Materjal': 'Hallmalmist korpus, roostevaba terasest spindel',
      'Suurus': 'DN50-DN500',
      'Rõhuklass': 'PN10-PN16',
      'Ühendus': 'Flantsitud vastavalt EN 1092-2'
    }
  },
  'ground-fire-hydrant': {
    id: 'ground-fire-hydrant',
    title: 'Maapealne tuletõrjekraan',
    description: 'Väga nähtav maapealne tuletõrjekraan kiireks juurdepääsuks veevarustusele hädaolukordades.',
    image: 'Ground fire hydrant .png',
    category: 'fire-protection',
    features: [
      'Automaaatne tühjendusventiil külmumise vältimiseks',
      'Kergelt märgatav punane värv',
      'Vastupidav korrosioonile',
      'Kiire aktiveerimissüsteem'
    ],
    applications: [
      'Linna tuletõrjeinfrastruktuur',
      'Tööstusrajatised',
      'Kaubanduskeskused',
      'Elamupiirkonnad',
      'Lennujaamad ja transpordisõlmed'
    ],
    specifications: {
      'Materjal': 'Kaetud malmist korpus',
      'Ühendus': 'Flantsühendus DN80-100',
      'Töörõhk': 'PN16',
      'Väljapääsud': '2-3 väljundit (Storz)',
      'Kõrgus': '750-1500mm',
      'Aktiveerimine': 'Hüdrandi võti'
    }
  }
};

// Latvian language product details
const lvProductDetailsMap: Record<string, ProductDetails> = {
  // Aluminum products in Latvian
  
  // Add missing category entries for Latvian
  
  // Missing fitting products for Latvian
  'corrugated-pipes': {
    id: 'corrugated-pipes',
    title: 'Dubultsienu gofrētās caurules',
    description: 'Dubultsienu gofrētās caurules ar gludu iekšējo sienu ūdens novadīšanas un kanalizācijas sistēmām.',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      'Augsta izturība pret deformāciju',
      'Lieliskas hidraulikas īpašības',
      'Vienkārša uzstādīšana',
      'Ilgs kalpošanas laiks'
    ],
    applications: [
      'Lietus ūdens kolektori',
      'Kanalizācijas sistēmas',
      'Meliorācijas sistēmas',
      'Ceļu būve'
    ]
  },
  'reinforced-pipe': {
    id: 'reinforced-pipe',
    title: 'Ar tēraudu pastiprinātas PE caurules',
    description: 'Polietilēna caurules ar tērauda pastiprinājumu augstām slodzēm un ekstremāliem apstākļiem.',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      'Izturīga konstrukcija ar tērauda pastiprinājumu',
      'Augsta spiediena izturība',
      'Izturība pret deformāciju',
      'Ķīmiska noturība'
    ],
    applications: [
      'Liela diametra cauruļvadi',
      'Pazemes instalācijas',
      'Rūpnieciskās sistēmas',
      'Augstas slodzes apstākļi'
    ]
  },
  'elbow-fitting': {
    id: 'elbow-fitting',
    title: '90° līkums',
    description: 'HDPE 90° līkums cauruļvadu virziena maiņai ar optimālu plūsmas veiktspēju.',
    image: elbow90,
    category: 'fittings',
    features: [
      'Viendabīga konstrukcija',
      'Vienkārša instalācija',
      'Izturīgs materiāls',
      'Dažādi izmēri'
    ],
    applications: [
      'Ūdens sadales sistēmas',
      'Notekūdeņu sistēmas',
      'Rūpnieciskās instalācijas',
      'Komunālie pakalpojumi'
    ]
  },
  'elbow-45-fitting': {
    id: 'elbow-45-fitting',
    title: '45° līkums',
    description: 'HDPE 45° līkums vieglai cauruļvadu virziena maiņai ar minimālu plūsmas pretestību.',
    image: elbow45,
    category: 'fittings',
    features: [
      'Optimāla plūsmas dinamika',
      'Izturīgs savienojums',
      'Ilgmūžīgs materiāls',
      'Saderīgs ar standarta caurulēm'
    ],
    applications: [
      'Kanalizācijas sistēmas',
      'Ūdensapgādes sistēmas',
      'Rūpnieciskās sistēmas',
      'Infrastruktūras projekti'
    ]
  },
  'tee-fitting': {
    id: 'tee-fitting',
    title: 'T-veida savienojums',
    description: 'HDPE T-veida savienojums atzarojumu izveidei cauruļvadu sistēmās ar izcilu strukturālo integritāti.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Trīs cauruļu savienošana',
      'Optimāla plūsmas sadale',
      'Augstas kvalitātes materiāls',
      'Pieejami dažādi izmēri'
    ],
    applications: [
      'Ūdensapgādes sistēmas',
      'Kanalizācijas tīkli',
      'Rūpnieciskie cauruļvadi',
      'Notekūdeņu sistēmas'
    ]
  },
  'flange-adapter': {
    id: 'flange-adapter',
    title: 'Atloka adapteris',
    description: 'HDPE atloka adapteris dažādu cauruļvadu sistēmu savienošanai ar uzticamu hermētisku savienojumu.',
    image: flangeAdapterShort,
    category: 'fittings',
    features: [
      'Universāla savietojamība',
      'Ūdensnecaurlaidīgs savienojums',
      'Izturīgs pret koroziju',
      'Vienkārša uzstādīšana'
    ],
    applications: [
      'Dažādu sistēmu integrācija',
      'Remonts un apkope',
      'Rūpnieciskās instalācijas',
      'Ūdensapgādes sistēmas'
    ]
  },
  'hsaw-water-pipes': {
    id: 'hsaw-water-pipes',
    title: 'HSAW caurules ūdensapgādei',
    description: 'Spirālveidā metinātas tērauda caurules ūdens transportēšanai ar izcilu spiediena izturību un ilgmūžību.',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      'Augsta spiediena izturība',
      'Spirālveida metināta konstrukcija',
      'Pretkorozijas aizsardzība',
      'Liels diametrs'
    ],
    applications: [
      'Ūdens magistrāles',
      'Pārvades līnijas',
      'Infrastruktūras projekti',
      'Pašvaldību ūdensapgāde'
    ]
  },
  'ground-fire-hydrant': {
    id: 'ground-fire-hydrant',
    title: 'Pazemes ugunsdzēsības hidrants',
    description: 'Augstas kvalitātes pazemes ugunsdzēsības hidrants ar efektīvu drenāžas sistēmu sala aizsardzībai.',
    image: groundFireHydrant,
    category: 'fire_protection',
    features: [
      'Automātiska drenāža pret sasalšanu',
      'Ātra piekļuve ārkārtas situācijās',
      'Kompakts dizains',
      'Atbilstība drošības standartiem'
    ],
    applications: [
      'Pilsētas ugunsdzēsības sistēmas',
      'Rūpnieciskās teritorijas',
      'Komerciālas zonas',
      'Sabiedriskās teritorijas'
    ]
  },
  'rainwater-grill-d400-type2': {
    id: 'rainwater-grill-d400-type2',
    title: 'Lietus ūdens reste D400 2. tips',
    description: 'Izturīga čuguna lietus ūdens reste ar uzlabotu ūdens savākšanas dizainu lielām slodzēm.',
    image: rainwaterGrillD4002,
    category: 'cast_iron',
    features: [
      'D400 slodzes klase (40 tonnas)',
      'Uzlabota ūdens savākšanas efektivitāte',
      'Izturīga čuguna konstrukcija',
      'Pretslīdes virsma'
    ],
    applications: [
      'Intensīvas satiksmes zonas',
      'Pilsētas ielas',
      'Komerciālas teritorijas',
      'Rūpnieciskās zonas'
    ]
  },
  'steel-pipes-oil-gas': {
    id: 'steel-pipes-oil-gas',
    title: 'Tērauda caurules naftas un gāzes transportam',
    description: 'Augstas izturības tērauda caurules naftas un gāzes transportēšanai ar īpašu aizsargpārklājumu.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Īpaša korozijas aizsardzība',
      'Augsta spiediena izturība',
      'API specifikācijām atbilstošs',
      'Ilgs kalpošanas laiks arī agresīvā vidē'
    ],
    applications: [
      'Naftas pārvade',
      'Dabasgāzes transportēšana',
      'Rūpnieciskās ķimikālijas',
      'Enerģētikas infrastruktūra'
    ]
  },
  'cast-iron': {
    id: 'cast-iron',
    title: 'Čuguna Izstrādājumi',
    description: 'Plaša čuguna izstrādājumu kolekcija infrastruktūras un būvniecības vajadzībām ar ilgmūžīgām īpašībām.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Augsta izturība un stiprība',
      'Izturība pret koroziju',
      'Ilgs kalpošanas laiks',
      'Atbilstība Eiropas standartiem'
    ],
    applications: [
      'Pilsētu infrastruktūra',
      'Ūdens apgādes sistēmas',
      'Kanalizācijas sistēmas',
      'Ceļu būve'
    ]
  },
  'aluminum': {
    id: 'aluminum',
    title: 'Alumīnija Izstrādājumi',
    description: 'Kvalitatīvi alumīnija izstrādājumi dažādām industriālām un komerciālām vajadzībām.',
    image: standardProfiles,
    category: 'aluminum',
    features: [
      'Viegla un izturīga konstrukcija',
      'Izturība pret koroziju',
      'Daudzveidīgas formas un izmēri',
      'Videi draudzīgs materiāls'
    ],
    applications: [
      'Būvniecība',
      'Transporta nozare',
      'Industriālie pielietojumi',
      'Arhitektūra un dizains'
    ]
  },
  'urban-infrastructure': {
    id: 'urban-infrastructure',
    title: 'Pilsētas Infrastruktūras Risinājumi',
    description: 'Pilsētas infrastruktūras risinājumi ar uzsvaru uz ilgtspēju un funkcionalitāti.',
    image: wellFacility,
    category: 'urban_infrastructure',
    features: [
      'Ilgtspējīgi materiāli',
      'Integrēti risinājumi',
      'Moderna dizaina elementi',
      'Viegla uzstādīšana un apkope'
    ],
    applications: [
      'Parki un atpūtas zonas',
      'Pilsētas centri',
      'Sabiedriskās teritorijas',
      'Transporta infrastruktūra'
    ]
  },
  'drainage-channel': {
    id: 'drainage-channel',
    title: 'Drenāžas Kanāli',
    description: 'Augstas izturības drenāžas kanāli efektīvai ūdens novadīšanai pilsētvidē un rūpnieciskās teritorijās.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Augsta slodzes izturība',
      'Efektīva ūdens novadīšana',
      'Vienkārša uzstādīšana',
      'Viegla apkope un tīrīšana'
    ],
    applications: [
      'Ielas un ceļi',
      'Autostāvvietas',
      'Rūpnieciskās teritorijas',
      'Sabiedriskās zonas'
    ]
  },
  'standard-profiles': {
    id: 'standard-profiles',
    title: 'Standarta alumīnija profili',
    description: 'Standarta alumīnija profili dažādiem pielietojumiem būvniecībā, inženierzinātnē un dizainā ar dažādām formām un izmēriem.',
    image: standardProfiles,
    category: 'alumīnijs',
    features: [
      'Plašs standarta formu klāsts',
      'Pieejami dažādi izmēri',
      'Augstas kvalitātes apdare',
      'Izcila izturības un svara attiecība',
      'Ekonomiski risinājumi'
    ],
    applications: [
      'Mēbeļu ražošana',
      'Interjera dizaina elementi',
      'Izstāžu sistēmas',
      'Vispārējā būvniecība',
      'Dekoratīvi elementi'
    ],
    specifications: {
      'Materiāls': 'Alumīnija sakausējums EN AW-6060, EN AW-6063',
      'Sakausējuma stāvoklis': 'T5, T6',
      'Virsmas apdare': 'Neapstrādāta, anodēta, pulverkrāsota',
      'Standarta garums': '6000 mm (±10 mm)',
      'Ražošanas metode': 'Karstā ekstrūzija'
    }
  },
  
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: 'Mašīnbūves profili',
    description: 'Specializēti alumīnija profili rūpnieciskajiem un mašīnbūves pielietojumiem ar uzlabotu precizitāti un izturību.',
    image: machineProfiles,
    category: 'alumīnijs',
    features: [
      'Augsta izmēru precizitāte',
      'Izcila stabilitāte',
      'Modulāras savienojuma iespējas',
      'Rievotu konstrukciju vienkāršai montāžai',
      'Saderība ar rūpnieciskām stiprinājumu sistēmām'
    ],
    applications: [
      'Iekārtas un aprīkojums',
      'Automatizētās sistēmas',
      'Rūpnieciskie rāmji',
      'Ražošanas līnijas',
      'Robotika'
    ],
    specifications: {
      'Materiāls': 'Alumīnija sakausējums EN AW-6063, EN AW-6082',
      'Sakausējuma stāvoklis': 'T5, T6',
      'Precizitāte': 'Augstāka nekā standarta profiliem',
      'Izmēru diapazons': 'No 20x20 mm līdz 80x80 mm',
      'Īpašības': 'Dažādas rievu sistēmas (ieskaitot T-rievas)'
    }
  },
  
  'led-profiles': {
    id: 'led-profiles',
    title: 'LED apgaismojuma profili',
    description: 'Speciāli alumīnija profili LED lentu uzstādīšanai un integrētu apgaismojuma sistēmu veidošanai.',
    image: ledProfiles,
    category: 'alumīnijs',
    features: [
      'Papildus difuzori un lēcas',
      'Iebūvēti vadu kanāli',
      'Efektīva siltuma pārvaldība',
      'Slēpta uzstādīšana',
      'Dažādas uzstādīšanas iespējas'
    ],
    applications: [
      'Mājas apgaismojums',
      'Komerciālais apgaismojums',
      'Mēbeļu apgaismojums',
      'Arhitektūras apgaismojums',
      'Dekoratīvi gaismas akcenti'
    ],
    specifications: {
      'Materiāls': 'Alumīnija sakausējums EN AW-6063',
      'Virsma': 'Anodēta, krāsota, neapstrādāta',
      'Saderība': 'Standarta LED lentes ar platumu 8-15 mm',
      'Papildu piederumi': 'Gala uzgaļi, turētāji, difuzori, lēcas',
      'Pieejamas krāsas': 'Sudraba, balta, melna, brūna'
    }
  },
  
  'special-profiles': {
    id: 'special-profiles',
    title: 'Speciālie alumīnija profili',
    description: 'Alumīnija profili ar nestandarta ģeometriju un izmēriem konkrētām nozarēm un specializētiem pielietojumiem.',
    image: specialProfiles,
    category: 'alumīnijs',
    features: [
      'Pielāgots dizains',
      'Specializētas funkcionālās īpašības',
      'Dažādas apdares iespējas',
      'Integrēti sistēmu risinājumi',
      'Iespēja ražot mazās partijās'
    ],
    applications: [
      'Transporta nozare',
      'Atjaunojamā enerģija',
      'Siltummaiņi',
      'Radiatori un dzesēšana',
      'Pielāgotās būvniecības sistēmas'
    ],
    specifications: {
      'Materiāls': 'Dažādu sēriju alumīnija sakausējumi',
      'Dizains': 'Pēc klienta specifikācijas vai nozares standartiem',
      'Apdare': 'Atbilstoši pielietojuma prasībām',
      'Garums': 'Standarta 6m vai pēc specifikācijas',
      'Minimālais pasūtījums': 'Atkarīgs no profila sarežģītības'
    }
  },
  
  // Categories in Latvian
  'steel': {
    id: 'steel',
    title: 'Tērauds',
    description: 'Augstas kvalitātes tērauda produkti',
    image: steelPipesOilGas,
    category: 'steel',
    features: [],
    applications: []
  },
  'cast iron': {
    id: 'cast iron',
    title: 'Čuguns',
    description: 'Augstas kvalitātes čuguna produkti',
    image: manholeD400,
    category: 'cast_iron',
    features: [],
    applications: []
  },
  'fittings': {
    id: 'fittings',
    title: 'Veidgabali',
    description: 'Augstas kvalitātes veidgabali',
    image: teeSmall,
    category: 'fittings',
    features: [],
    applications: []
  },
  'polyethylene': {
    id: 'polyethylene',
    title: 'Polietilēns',
    description: 'Augstas kvalitātes polietilēna produkti',
    image: hdpePipes,
    category: 'polyethylene',
    features: [],
    applications: []
  },
  
  // Product entries in Latvian
  'double-corrugated-pipes': {
    id: 'double-corrugated-pipes',
    title: 'Dubultsienu gofrētas caurules',
    description: 'Dubultsienu gofrētas polietilēna caurules drenāžai un kanalizācijai ar uzlabotu stingrību un plūsmas raksturlielumiem.',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      'Augsta aploces stingrība',
      'Viegla un vienkārša uzstādīšana',
      'Izturība pret ķīmiskām vielām',
      'Ilgs kalpošanas laiks (virs 50 gadiem)',
      'Izturība pret agresīvu augsni'
    ],
    applications: [
      'Lietus ūdens drenāžas sistēmas',
      'Ceļu drenāžas sistēmas',
      'Sadzīves notekūdeņu savākšana',
      'Lauksaimniecības drenāžas sistēmas',
      'Kabelizācija un cauruļvadu aizsardzība'
    ],
    specifications: {
      'Materiāls': 'HDPE (augstas blīvuma polietilēns)',
      'Standarts': 'EN 13476',
      'Diametri': '110mm līdz 1000mm',
      'Gredzena stingrība': 'SN4, SN8, SN16 kN/m²',
      'Krāsa': 'Melna ārpuse, zaļa vai zila iekšpuse',
      'Savienojums': 'Uzmavu savienojums ar gumijas blīvgredzenu'
    }
  },
  'reinforced-corrugated-pipes': {
    id: 'reinforced-corrugated-pipes',
    title: 'Armētas gofrētas caurules',
    description: 'Tērauda armētas polietilēna gofrētas caurules ar pastiprinātu strukturālo integritāti sarežģītos apstākļos.',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      'Pastiprināta izturība un nodilumizturība',
      'Izturība pret lielām slodzēm',
      'Uzlabota pretestība deformācijai',
      'Saglabāta polietilēna elastība',
      'Uzlabota izturība pret temperatūras svārstībām'
    ],
    applications: [
      'Augsta spiediena transportēšana',
      'Pazemes komunikācijas',
      'Kalnrūpniecība',
      'Jūras cauruļvadi',
      'Sarežģīti ģeoloģiskie apstākļi'
    ],
    specifications: {
      'Armējuma tips': 'Tērauda kords vai stiklšķiedra',
      'Diametrs': '50-1200 mm',
      'Darba spiediens': 'Līdz 30 bar',
      'Izturība pret': 'UV starojumu, zemām temperatūrām',
      'Temperatūras režīms': 'no -40°C līdz +60°C'
    }
  },
  'elbow-fittings': {
    id: 'elbow-fittings',
    title: '90° Līkums',
    description: '90° līkumi polietilēna cauruļvadu sistēmām, nodrošinot virzienā maiņu cauruļvadu tīklos.',
    image: elbow90,
    category: 'fittings',
    features: [
      'Precīza 90° virziena maiņa',
      'Viengabalaina integrācija ar cauruļu sistēmām',
      'Identiskas materiāla īpašības ar galvenajām caurulēm',
      'Pieejams dažādos leņķos',
      'Saderīgs ar visām savienošanas metodēm'
    ],
    applications: [
      'Virziena maiņa cauruļvadu sistēmās',
      'Ūdens sadales tīkli',
      'Gāzes sadales sistēmas',
      'Kanalizācijas sistēmas',
      'Rūpniecisko šķidrumu transports'
    ],
    specifications: {
      'Materiāls': 'PE100 augstas blīvuma polietilēns',
      'Leņķi': '90°, kā arī 45° un citi',
      'Diametru diapazons': '20mm līdz 800mm',
      'Spiediena vērtējums': 'Atbilst savienotajiem cauruļvadiem',
      'Savienojums': 'Ķīļsavienojums, elektrofūzija vai atloksavienojums'
    }
  },
  'tee-fittings': {
    id: 'tee-fittings',
    title: 'T-veida savienojumi',
    description: 'T-veida savienojumi polietilēna cauruļvadu sistēmām, kas nodrošina trīsvirzienu plūsmas sadalīšanu vai apvienošanu.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Vienmērīga plūsmas sadale',
      'Izturīga konstrukcija',
      'Precīza ģeometrija',
      'Dažādu diametru varianti',
      'Vienādi un samazināti modeļi'
    ],
    applications: [
      'Ūdens sadales tīkli',
      'Gāzes sadales sistēmas',
      'Kanalizācijas sistēmas',
      'Apūdeņošanas sistēmas',
      'Rūpniecisko šķidrumu transports'
    ],
    specifications: {
      'Materiāls': 'PE100 augstas blīvuma polietilēns',
      'Veidi': 'Vienādi un samazināti',
      'Diametru diapazons': '20mm līdz 800mm',
      'Spiediena vērtējums': 'Atbilst savienotajiem cauruļvadiem',
      'Savienojums': 'Ķīļsavienojums, elektrofūzija vai atloksavienojums'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: 'Kanalizācijas lūku vāki',
    description: 'Izturīgi čuguna kanalizācijas lūku vāki un rāmji pilsētas infrastruktūrai ar dažādām slodzes klasifikācijām.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Izturīga čuguna konstrukcija',
      'Dažādas slodzes klasifikācijas (A15 līdz F900)',
      'Pretiezagšanas dizaina iespējas',
      'Papildu bloķēšanas sistēmas',
      'Pielāgojami virsmas raksti'
    ],
    applications: [
      'Ceļu infrastruktūra',
      'Gājēju zonas',
      'Komercplatības',
      'Rūpniecības teritorijas',
      'Pilsētas drenāžas sistēmas'
    ],
    specifications: {
      'Materiāls': 'Kaļamais čuguns GGG50/GJS-500-7',
      'Standarts': 'EN 124',
      'Slodzes klases': 'D400 (40 tonnas)',
      'Pārklājums': 'Uz ūdens bāzes melnā bituma krāsa',
      'Atvere': 'Tīrā atvere atkarīga no modeļa',
      'Uzstādīšana': 'Iebetonēšana betonā vai asfaltā'
    }
  },
  'rainwater-grills': {
    id: 'rainwater-grills',
    title: 'Lietus ūdens restes',
    description: 'Izturīgas čuguna drenāžas restes ar optimizētu ūdens uzņemšanas jaudu pilsētas drenāžas sistēmām.',
    image: rainwaterGrillD400,
    category: 'cast_iron',
    features: [
      'Augsta slodzes kapacitāte D400 klasifikācija',
      'Optimizēts režģa raksts efektīvai ūdens savākšanai',
      'Pretslīdes virsma gājēju drošībai',
      'Dažādas uzstādīšanas iespējas',
      'Ilgmūžīga čuguna konstrukcija'
    ],
    applications: [
      'Pilsētas ielas un autoceļi',
      'Stāvvietas un komercplatības',
      'Lietus ūdens savākšanas sistēmas',
      'Gājēju zonas un laukumi',
      'Rūpnieciskās teritorijas'
    ],
    specifications: {
      'Materiāls': 'Kaļamais čuguns GGG50/GJS-500-7',
      'Standarts': 'EN 124',
      'Slodzes klase': 'C250, D400 (25-40 tonnas)',
      'Pārklājums': 'Melna bituma krāsa',
      'Izmēri': 'Dažādi, atbilstoši specifikācijām',
      'Konstrukcija': 'Režģis ar optimizētu hidraulisko efektivitāti'
    }
  },

  'hsaw-pipes': {
    id: 'hsaw-pipes',
    title: 'HSAW tērauda caurules',
    description: 'Spirālveida iegremdētās loka metināšanas caurules (HSAW) ar augstas precizitātes metināšanas tehnoloģiju ūdens infrastruktūrai.',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      'Augsta izturība un strukturālā integritāte',
      'Precīza spirālveida metināšanas tehnoloģija',
      'Uzlabota korozijas aizsardzība',
      'Piemērots lielam diametram un biezām sienām',
      'Cost-effective manufacturing process'
    ],
    applications: [
      'Komunālā ūdens pārvade',
      'Lielas slodzes ūdens maģistrāles',
      'Rūpnieciskās ūdens sistēmas',
      'Ūdens pārsūknēšanas stacijas',
      'Ūdens uzglabāšanas sistēmas'
    ],
    specifications: {
      'Materiāls': 'Oglekļa tērauds',
      'Standarts': 'API 5L, AWWA C200',
      'Diametrs': '400mm līdz 3000mm',
      'Sienas biezums': '6mm līdz 25mm',
      'Pārklājums': 'FBE, 3LPE, cementa java vai epoksīdsveķi',
      'Savienojums': 'Metināti vai atloksavienojumi'
    }
  },
  'oil-gas-pipes': {
    id: 'oil-gas-pipes',
    title: 'Naftas un gāzes caurules',
    description: 'Augstspiediena tērauda caurules, īpaši projektētas naftas un gāzes transportēšanai ar izcilu korozijas izturību.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Augstspiediena izturība',
      'Uzlabota aizsardzība pret koroziju',
      'API 5L atbilstība',
      'X42 līdz X70 tērauda klases',
      'Specializētas pārklājuma iespējas'
    ],
    applications: [
      'Jēlnaftas transportēšana',
      'Dabasgāzes cauruļvadi',
      'Naftas pārstrādes rūpnīcas',
      'Jūras platformas',
      'Sadales tīkli'
    ],
    specifications: {
      'Tips': 'Bezšuvju vai metinātas',
      'Standarts': 'API 5L, ISO 3183',
      'Diametrs': '114.3mm līdz 1219.2mm',
      'Sienas biezums': '6.4mm līdz 25.4mm',
      'Pārklājums': 'FBE, 3LPE vai 3LPP',
      'Darba temperatūra': '-45°C līdz +80°C'
    }
  },
  'pile-pipes': {
    id: 'pile-pipes',
    title: 'Pāļu caurules',
    description: 'Augstas izturības spirālveida metinātas tērauda caurules (HSAW) dziļiem pāļu pamatiem un krasta nostiprinājumiem.',
    image: hsawPilesPurpose,
    category: 'steel',
    features: [
      'Ļoti augsta strukturālā izturība',
      'Optimizēts svars un izturība',
      'Precīza spirālveida metināšanas tehnoloģija',
      'Īpaši projektēts zemūdens un grunts apstākļiem',
      'Daudzpusīgi uzgaļu un savienojumu varianti'
    ],
    applications: [
      'Dziļi pāļu pamati',
      'Ostas būves un moli',
      'Krasta nostiprinājumi',
      'Tilti un viadukti',
      'Smago konstrukciju atbalsts'
    ],
    specifications: {
      'Materiāls': 'Augstas izturības oglekļa tērauds',
      'Diametrs': '300mm līdz 3000mm',
      'Sienas biezums': '8mm līdz 40mm',
      'Metināšanas process': 'Spirālveida iegremdētā loka metināšana (HSAW)',
      'Virsmas apstrāde': 'Attīrīta ar smilšu strūklu un gruntēta',
      'Izturības klase': 'S355, S420 vai augstāka'
    }
  },
  
  // Categories in Latvian
  'waste-box': {
    id: 'waste-box',
    title: 'Pilsētas atkritumu savākšanas konteiners',
    description: 'Moderna, izturīga atkritumu savākšanas kaste pilsētvides vajadzībām ar ergonomisku dizainu un noturību pret laikapstākļiem.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Pret laikapstākļiem izturīga konstrukcija',
      'Ergonomisks atvēršanas mehānisms',
      'Viegla iztukšošanas sistēma',
      'Pret kaitēkļiem izturīgs dizains',
      'UV stabilizēti materiāli'
    ],
    applications: [
      'Pilsētas ielas un parki',
      'Autobusu pieturas un tranzīta stacijas',
      'Komercplatības',
      'Izglītības iestādes',
      'Atpūtas zonas'
    ],
    specifications: {
      'Materiāls': 'Augstas triecienizturības polietilēns ar metāla rāmi',
      'Tilpums': '30 litri',
      'Izmēri': '400×300×700mm',
      'Uzstādīšana': 'Iespēja uzstādīt uz virsmas vai uz staba',
      'Iespējas': 'Cigarešu dzēsējs, pārstrādes opcijas',
      'Krāsa': 'Pieejamas dažādas pašvaldību krāsu opcijas'
    }
  },
  
  // Categories in Latvian
  'urban infrastructure': {
    id: 'urban infrastructure',
    title: 'Pilsētas infrastruktūra',
    description: 'Pilsētas infrastruktūras produkti',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [],
    applications: []
  },
  
  // Infrastructure products in Latvian
  'rainwater-grill-d400-standard': {
    id: 'rainwater-grill-d400-standard',
    title: 'Lietus ūdens restes D400',
    description: 'Lieljaudas D400 lietus ūdens restes, kas paredzētas drenāžai intensīvas satiksmes zonās, piemēram, ceļos un komerczonās.',
    image: rainwaterGrillD400,
    category: 'cast_iron',
    features: [
      'Izturīga čuguna konstrukcija',
      'D400 slodzes klasifikācija (40 tonnas)',
      'Optimizēts ūdens plūsmas dizains',
      'Pretaizsprostošanas struktūra',
      'Drošas uzstādīšanas iespējas'
    ],
    applications: [
      'Ceļu drenāžas sistēmas',
      'Pilsētu infrastruktūra',
      'Komerciālās zonas',
      'Industriālās teritorijas',
      'Autostāvvietas'
    ],
    specifications: {
      'Materiāls': 'Kaļamais čuguns GGG50/GJS-500-7',
      'Standarts': 'EN 124',
      'Slodzes klase': 'D400 (40 tonnas)',
      'Pārklājums': 'Melna bituma krāsa',
      'Izmēri': '600×600mm (tīrais atvērums)',
      'Svars': 'Apm. 55-65 kg'
    }
  },
  'rainwater-grill-d400-2': {
    id: 'rainwater-grill-d400-2',
    title: 'Lietus ūdens restes Premium D400',
    description: 'Augstas kvalitātes D400 lietus ūdens restes ar uzlabotu dizainu un palielinātu ūdens plūsmas kapacitāti.',
    image: rainwaterGrillD4002,
    category: 'cast_iron',
    features: [
      'Inovatīvs restes dizains',
      'Paaugstināta ūdens caurlaidība',
      'Pastiprināta čuguna konstrukcija',
      'Uzlabota virsmas apstrāde',
      'Troksni slāpējoša konstrukcija'
    ],
    applications: [
      'Intensīvas satiksmes ceļi',
      'Automaģistrāles',
      'Pilsētu centri',
      'Rūpnieciskās zonas',
      'Laukumi un stāvvietas'
    ],
    specifications: {
      'Materiāls': 'Kaļamais čuguns GGG50/GJS-500-7',
      'Standarts': 'EN 124',
      'Slodzes klase': 'D400 (40 tonnas)',
      'Pārklājums': 'Premium melna bituma krāsa',
      'Izmēri': '600×600mm (tīrais atvērums)',
      'Funkcijas': 'Pretizādzības fiksācijas sistēma'
    }
  },
  'rainwater-grill-meria': {
    id: 'rainwater-grill-meria',
    title: 'Lietus ūdens restes MERIA sērija',
    description: 'Premium MERIA dizaina lietus ūdens restes mūsdienīgām pilsētu ainavām, kas apvieno funkcionalitāti ar estētisku pievilcību.',
    image: rainwaterGrillMeria,
    category: 'cast_iron',
    features: [
      'Atšķirīgs MERIA raksta dizains',
      'D400 slodzes klasifikācija (40 tonnas)',
      'Izcila hidrauliskā efektivitāte',
      'Uzlabota pretslīdes aizsardzība',
      'Arhitektūras līmeņa apdare'
    ],
    applications: [
      'Pilsētu centri un sabiedriskie laukumi',
      'Gājējiem draudzīgas pilsētu zonas',
      'Komerciālie rajoni',
      'Vēsturiskās saglabāšanas zonas',
      'Premium ainavu attīstība'
    ],
    specifications: {
      'Materiāls': 'Kaļamais čuguns GGG50/GJS-500-7',
      'Standarts': 'EN 124',
      'Slodzes klase': 'D400 (40 tonnas)',
      'Pārklājums': 'Premium melna bituma krāsa',
      'Izmēri': '500×500mm (tīrais atvērums)',
      'Funkcijas': 'Pretizādzības bloķēšanas sistēma'
    }
  },
  'rainwater-grill-f900': {
    id: 'rainwater-grill-f900',
    title: 'Lietus ūdens restes F900 lieljaudas',
    description: 'Ultra lieljaudas F900 lietus ūdens restes, kas paredzētas ekstremālām slodzes apstākļiem rūpnieciskās un ostas vidēs.',
    image: rainwaterGrillF900,
    category: 'cast_iron',
    features: [
      'Maksimālā slodzes kapacitāte F900 (90 tonnas)',
      'Pastiprināts strukturālais dizains',
      'Rūpnieciska līmeņa izturība',
      'Augsta plūsmas kapacitāte',
      'Ekstremālas vides pretestība'
    ],
    applications: [
      'Lidostu skrejceļi un manevrēšanas ceļi',
      'Konteineru termināļi un ostas',
      'Smagās rūpniecības zonas',
      'Loģistikas centri',
      'Militārie objekti'
    ],
    specifications: {
      'Materiāls': 'Augstas izturības čuguns GGG60',
      'Standarts': 'EN 124',
      'Slodzes klase': 'F900 (90 tonnas)',
      'Pārklājums': 'Pastiprināta pretkorozijas krāsa',
      'Izmēri': 'Dažādi rūpnieciskie izmēri',
      'Uzstādīšana': 'Nepieciešams speciāls augstas izturības pamats'
    }
  },
  'ground-fire-hydrant-lv': {
    id: 'ground-fire-hydrant-lv',
    title: 'Pazemes ugunsdzēsības hidrants',
    description: 'Pazemes ugunsdzēsības hidrantu sistēma efektīvai piekļuvei ūdenim ugunsdzēsības vajadzībām pilsētu un rūpnieciskos rajonos.',
    image: groundFireHydrant,
    category: 'fire-protection',
    features: [
      'Ātra piekļuve',
      'Satiksmei droša pazemes uzstādīšana',
      'Aizsargāta pret sasalšanu vārstu sistēma',
      'Pašdrenāžas iespēja',
      'Standarta savienojuma saskarne'
    ],
    applications: [
      'Pilsētu ugunsdrošības tīkli',
      'Komerciālie rajoni',
      'Rūpniecības zonas',
      'Lidostas un transporta mezgli',
      'Institucionālās ēkas'
    ],
    specifications: {
      'Materiāls': 'Čuguns ar nerūsējošā tērauda komponentiem',
      'Darba spiediens': 'PN16',
      'Dziļums': 'Regulējams atbilstoši sasalšanas līnijai',
      'Savienojumi': 'Standarta ugunsdzēsības savienojumi',
      'Atbilstība': 'EN 14339, GOST'
    }
  },
  'gate-valve': {
    id: 'gate-valve',
    title: 'Čuguna aizbīdnis',
    description: 'Čuguna aizbīdņi ūdens apgādes sistēmām un rūpnieciskajam pielietojumam ar izcilu blīvējumu un ilgu kalpošanas laiku.',
    image: gateValve,
    category: 'valves',
    features: [
      'Izturīga čuguna konstrukcija',
      'Spiediena klases PN10-16',
      'Vienkārša darbība un apkope',
      'Pilnīgs plūsmas noslēgums',
      'Ilgs kalpošanas laiks'
    ],
    applications: [
      'Ūdens apgādes sistēmas',
      'Ūdens attīrīšanas iekārtas',
      'Rūpnieciskie procesi',
      'Sadales tīkli',
      'Ugunsdzēsības sistēmas'
    ],
    specifications: {
      'Korpusa materiāls': 'Čuguns GG25/GJL-250',
      'Vārpstas materiāls': 'Nerūsējošais tērauds',
      'Darba spiediens': 'PN10-16',
      'Izmēri': 'DN50-500',
      'Temperatūra': 'no -10°C līdz +120°C',
      'Vadība': 'Manuāla ar elektriskās piedziņas iespēju'
    }
  },
  'hdpe-pipes-lv': {
    id: 'hdpe-pipes',
    title: 'HDPE caurules (PE100)',
    description: 'Augstas blīvuma polietilēna caurules ūdens, gāzes un kanalizācijas sistēmām.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Izcila ķīmiskā izturība',
      'Ilgs kalpošanas laiks (50+ gadi)',
      'Elastīgas un vieglas',
      'Korozijas izturīgas',
      'Zemas uzturēšanas izmaksas'
    ],
    applications: [
      'Dzeramā ūdens transports',
      'Kanalizācijas sistēmas',
      'Gāzes cauruļvadi',
      'Rūpniecisko šķidrumu pārvadāšana',
      'Drenāžas sistēmas'
    ],
    specifications: {
      'Materiāls': 'PE100 augsta blīvuma polietilēns',
      'Standarti': 'EN 12201, ISO 4427',
      'Diametri': '20mm līdz 2000mm',
      'Spiediena klase': 'PN6.3 līdz PN25',
      'Savienojumi': 'Elektrofūzija, izdedžu metināšana, mehāniskie savienojumi'
    }
  },
  'steel-pipes-water': {
    id: 'steel-pipes-water',
    title: 'Spirālmetināti tērauda caurules',
    description: 'Augsti izturīgi spirālmetināti tērauda caurules liela diametra ūdensapgādes, kanalizācijas un rūpnieciskām vajadzībām.',
    image: hsawPilesWater, // Using the Helical Submerged Arc Welded Pipes image
    category: 'steel',
    features: [
      'Augsta strukturālā integritāte',
      'Liela diametra risinājumi',
      'Pielāgojami izmēri un garumi',
      'Iekšējais un ārējais pārklājums',
      'Augsta spiediena izturība'
    ],
    applications: [
      'Komunālie ūdens cauruļvadi',
      'Lietus ūdens un kanalizācijas sistēmas',
      'Rūpnieciskās ūdens sistēmas',
      'Hidroelektrostaciju ūdensvadi',
      'Dzeramā ūdens pārvadāšana'
    ],
    specifications: {
      'Materiāls': 'Oglekļa tērauds',
      'Standarti': 'EN 10217, AWWA C200',
      'Diametri': '406mm līdz 2540mm',
      'Sieniņu biezums': '4mm līdz 20mm',
      'Pārklājums': 'Epoksīda, cementa apmetums, PE, PP vai pēc specifikācijas'
    }
  },
  'manhole-cover-d400': {
    id: 'manhole-cover-d400',
    title: 'Čuguna kanalizācijas lūku vāki D400',
    description: 'Augstas izturības čuguna kanalizācijas lūku vāki intensīvas noslodzes zonām ar drošības un trokšņa mazināšanas funkcijām.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'D400 slodzes klase (40 tonnas)',
      'Troksni slāpējoša konstrukcija',
      'Ventilācijas atveres pieejamas',
      'Pretizādzības mehānisms',
      'Vienkārša uzstādīšana un apkope'
    ],
    applications: [
      'Pilsētas ielas un ceļi',
      'Stāvlaukumi un komerciālās zonas',
      'Industriālās teritorijas',
      'Ražošanas iekārtas',
      'Loģistikas centri'
    ],
    specifications: {
      'Materiāls': 'Kaļamais čuguns GGG50/GJS-500-7',
      'Standarts': 'EN 124',
      'Atvērums': '600mm vai pēc specifikācijas',
      'Kopējais augstums': '100mm līdz 160mm',
      'Rāmja izmērs': '850mm x 850mm (standarta)'
    }
  },
  // Aluminum products in Latvian
  'structural-aluminum': {
    id: 'structural-aluminum',
    title: 'Strukturālais alumīnijs',
    description: 'Augstas izturības alumīnija profili, kas paredzēti strukturāliem pielietojumiem būvniecības un rūpniecības nozarēs.',
    image: standardProfiles, // Using aluminum u-profiles image
    category: 'aluminum',
    features: [
      'Augsta izturības un svara attiecība',
      'Izcila korozijas izturība',
      'Izmēru stabilitāte',
      'Laba siltumvadītspēja',
      'Nemagnētiskas īpašības'
    ],
    applications: [
      'Rūpnieciskās rāmji un konstrukcijas',
      'Būvniecības karkasi',
      'Moduļu būvniecības sistēmas',
      'Komerciālās konstrukcijas',
      'Infrastruktūras projekti'
    ],
    specifications: {
      'Sakausējuma veids': '6000 sērija (6061, 6063, 6082)',
      'Rūdījums': 'T5, T6',
      'Tecēšanas robeža': '240-260 MPa',
      'Stiepes izturība': '290-310 MPa',
      'Virsmas apstrāde': 'Rūpnīcas apdare, anodēšana, pulverkrāsošana'
    }
  },
  'architectural-aluminum': {
    id: 'architectural-aluminum',
    title: 'Arhitektūras alumīnijs',
    description: 'Premium alumīnija profili fasādēm, logiem un dekoratīviem arhitektūras elementiem.',
    image: tProfiles, // Using aluminum t-profiles image
    category: 'aluminum',
    features: [
      'Estētiski pievilcīgs izskats',
      'Plašs apdares un krāsu klāsts',
      'Izturība pret laikapstākļiem',
      'Ilgmūžība un zemas uzturēšanas prasības',
      'Izcila veidojamība'
    ],
    applications: [
      'Fasāžu sistēmas',
      'Logu un durvju rāmji',
      'Dekoratīvie ēku elementi',
      'Saules aizsardzības ekrāni un žalūzijas',
      'Iekšējās starpsienas'
    ],
    specifications: {
      'Sakausējuma veids': '6000 sērija (galvenokārt 6063)',
      'Rūdījums': 'T5, T6',
      'Apdares opcijas': 'Anodēšana, pulverkrāsošana, koka imitācija',
      'Krāsu iespējas': 'Saskaņā ar RAL katalogu',
      'Sienas biezums': '1.2-3.0 mm'
    }
  },
  'industrial-aluminum': {
    id: 'industrial-aluminum',
    title: 'Rūpnieciskais alumīnijs',
    description: 'Specializētie alumīnija profili ražošanai, mašīnu komponentiem un rūpnieciskiem pielietojumiem.',
    image: ledProfiles, // Using LED profiles image for industrial applications
    category: 'aluminum',
    features: [
      'Augsta izmēru precizitāte',
      'Izcila apstrādājamība',
      'Konstrukcijas elastība',
      'Izturība pret ekstremāliem apstākļiem',
      'Laba elektrovadītspēja'
    ],
    applications: [
      'Automatizētās iekārtas',
      'Konveijeru sistēmas',
      'Rūpnieciskās rāmji',
      'Elektriskās korpusi',
      'Radiatori un siltummaiņi'
    ],
    specifications: {
      'Sakausējuma veids': '6000 un 7000 sērijas',
      'Pielaides': 'Atbilstība DIN/ISO standartiem',
      'Virsmas apstrāde': 'Anodēšana, pasivācija',
      'Savienošanas metodes': 'T-rievas, stiprinājumi un savienotāji',
      'Modularitāte': 'Saderība ar rūpniecības standartiem'
    }
  },
  'custom-aluminum': {
    id: 'custom-aluminum',
    title: 'Pielāgotie risinājumi',
    description: 'Individuāli pielāgoti alumīnija profilu risinājumi, kas izstrādāti konkrētu projekta prasību apmierināšanai.',
    image: specialProfiles, // Using special aluminum profile image showing custom extrusions
    category: 'aluminum',
    features: [
      'Projektēšana atbilstoši klienta specifikācijām',
      'Formas optimizācija konkrētam pielietojumam',
      'Speciāli sakausējumi īpašām prasībām',
      'Pielāgotas mehāniskās īpašības',
      'Nestandarta izmēri un formas'
    ],
    applications: [
      'Specializētas transporta iekārtas',
      'Unikāli būvelementi',
      'Kosmosa komponentes',
      'Jūras pielietojumi',
      'Īpašas rūpnieciskās mašīnas'
    ],
    specifications: {
      'Sakausējuma veids': 'Izvēlēts atbilstoši prasībām',
      'Ražošanas process': 'CNC ekstrūzija, frēzēšana, precīza apstrāde',
      'Dokumentācija': 'Pilna tehniskā dokumentācija un sertifikāti',
      'Prototipu izstrāde': 'Pieejama ātra prototipu izstrāde',
      'Minimālais pasūtījums': 'Elastīgi nosacījumi īpašiem projektiem'
    }
  },
  
  // Infrastructure products translations - Latvian
  'rainwater-grill-d400': {
    id: 'rainwater-grill-d400',
    title: 'Lietus ūdens reste D400',
    description: 'Augstas izturības D400 lietus ūdens restes, kas paredzētas ūdens novadīšanai intensīvas satiksmes zonās.',
    image: 'Rainwater grill D400 1 .png',
    category: 'cast_iron',
    features: [
      'Augsta slodzes izturība līdz D400 (40 tonnām)',
      'Pielāgots ceļu satiksmei',
      'Pretslīdes virsma',
      'Viegli uzstādīt un uzturēt'
    ],
    applications: [
      'Ielas un ceļi',
      'Autostāvvietas',
      'Komerciālie un rūpnieciskie objekti',
      'Pilsētas vide'
    ],
    specifications: {
      'Materiāls': 'Čuguna rāmis un reste',
      'Slodzes klasifikācija': 'D400 saskaņā ar EN 124',
      'Izmēri': '600 x 600 mm (standarta izmērs)',
      'Apdare': 'Melna bitumena vai pulvera pārklājums'
    }
  },
  'manhole-covers-alt': {
    id: 'manhole-covers-alt',
    title: 'Kanalizācijas lūkas un rāmji',
    description: 'Izturīgi čuguna kanalizācijas lūkas un rāmji pilsētas infrastruktūrai ar dažādām slodzes klasēm.',
    image: 'Circular manhole cover (С250)K H80 .png',
    category: 'cast_iron',
    features: [
      'Pieejamas dažādas slodzes klases: B125, C250, D400',
      'Ar eņģēm vai bez eņģu dizains',
      'Bloķēšanas mehānisms drošībai',
      'Trokšņa slāpēšanas dizains'
    ],
    applications: [
      'Ielas un ceļi',
      'Ietves',
      'Gājēju zonas',
      'Kanalizācijas sistēmas'
    ],
    specifications: {
      'Materiāls': 'Augstas kvalitātes pelēkais čuguns',
      'Slodzes klasifikācija': 'No B125 līdz D400',
      'Diametrs': '600mm, 800mm, 1000mm (standarta izmēri)',
      'Augstums': '80mm līdz 150mm, atkarībā no klases'
    }
  },
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: 'HDPE caurules (PE100)',
    description: 'Augstas blīvuma polietilēna caurules ar izcilu ķīmisko izturību ūdens, gāzes un notekūdeņu sistēmām.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Izcila ķīmiskā izturība',
      'Ilgs kalpošanas laiks (50+ gadi)',
      'Elastīgas un vieglas',
      'Korozijas izturīgas',
      'Zemas uzturēšanas izmaksas'
    ],
    applications: [
      'Dzeramā ūdens pārvade',
      'Kanalizācijas sistēmas',
      'Gāzes cauruļvadi',
      'Rūpniecisko šķidrumu pārvade',
      'Drenāžas sistēmas'
    ],
    specifications: {
      'Materiāls': 'PE100 augstas blīvuma polietilēns',
      'Standarti': 'EN 12201, ISO 4427',
      'Diametri': '20mm līdz 2000mm',
      'Spiediena klase': 'PN6.3 līdz PN25',
      'Savienojumi': 'Elektrofūzija, kontaktsavienojums, mehāniskie savienojumi'
    }
  },
  'gate-valve-lv': {
    id: 'gate-valve',
    title: 'Aizbīdnis',
    description: 'Čuguna aizbīdņi ūdensapgādes sistēmām un rūpnieciskai lietošanai ar lielisku blīvējumu un ilgu kalpošanas laiku.',
    image: gateValve,
    category: 'valves',
    features: [
      'Pilna caurplūde atvērtā stāvoklī',
      'Zems spiediena zudums',
      'Ilgstoša blīvēšanas spēja',
      'Divvirzienu plūsmas kontrole'
    ],
    applications: [
      'Ūdensapgādes sistēmas',
      'Notekūdeņu sistēmas',
      'Rūpnieciskās sistēmas',
      'Apūdeņošanas sistēmas'
    ],
    specifications: {
      'Materiāls': 'Pelēkā čuguna korpuss, nerūsējošā tērauda vārpsta',
      'Izmērs': 'DN50-DN500',
      'Spiediena klase': 'PN10-PN16',
      'Savienojums': 'Atloku saskaņā ar EN 1092-2'
    }
  },
  'ground-fire-hydrant-above-lv': {
    id: 'ground-fire-hydrant',
    title: 'Virszemes ugunsdzēsības hidrants',
    description: 'Ļoti pamanāms virszemes ugunsdzēsības hidrants ārkārtas situācijās ātrai piekļuvei ūdensapgādei.',
    image: 'Ground fire hydrant .png',
    category: 'fire-protection',
    features: [
      'Automātiskais drenāžas vārsts aizsalšanas novēršanai',
      'Viegli pamanāma sarkanā krāsa',
      'Izturīgs pret koroziju',
      'Ātra aktivizēšanas sistēma'
    ],
    applications: [
      'Pilsētas ugunsdzēsības infrastruktūra',
      'Rūpnieciskās ēkas',
      'Tirdzniecības centri',
      'Dzīvojamie kompleksi',
      'Lidostas un transporta termināļi'
    ],
    specifications: {
      'Materiāls': 'Pārklāts čuguns',
      'Savienojums': 'Atloka savienojums DN80-100',
      'Darba spiediens': 'PN16',
      'Izvadi': '2-3 izvadi (Storz)',
      'Augstums': '750-1500mm',
      'Aktivizēšana': 'Hidranta atslēga'
    }
  }
};

// Lithuanian language product details
const ltProductDetailsMap: Record<string, ProductDetails> = {
  // Aluminum products in Lithuanian
  
  // Add missing category entries for Lithuanian
  
  // Missing fitting products for Lithuanian
  'corrugated-pipes': {
    id: 'corrugated-pipes',
    title: 'Dvigubos sienelės gofruoti vamzdžiai',
    description: 'Dvigubos sienelės gofruoti vamzdžiai su lygiu vidiniu paviršiumi vandens nuvedimo ir kanalizacijos sistemoms.',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      'Didelis atsparumas deformacijai',
      'Puikios hidraulinės savybės',
      'Lengvas montavimas',
      'Ilgas tarnavimo laikas'
    ],
    applications: [
      'Lietaus vandens kolektoriai',
      'Kanalizacijos sistemos',
      'Drenažo sistemos',
      'Kelių statyba'
    ]
  },
  'reinforced-pipe': {
    id: 'reinforced-pipe',
    title: 'Plienu sustiprinti PE vamzdžiai',
    description: 'Polietileno vamzdžiai su plieno sutvirtinimu didelėms apkrovoms ir ekstremalioms sąlygoms.',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      'Tvirta konstrukcija su plieno sustiprinimu',
      'Didelis atsparumas slėgiui',
      'Atsparumas deformacijai',
      'Cheminis atsparumas'
    ],
    applications: [
      'Didelio skersmens vamzdynai',
      'Požeminės instaliacijos',
      'Pramoninės sistemos',
      'Didelės apkrovos sąlygos'
    ]
  },
  'elbow-fitting': {
    id: 'elbow-fitting',
    title: '90° alkūnė',
    description: 'HDPE 90° alkūnė vamzdynų krypties keitimui su optimaliu srauto pralaidumu.',
    image: elbow90,
    category: 'fittings',
    features: [
      'Vientisa konstrukcija',
      'Paprastas montavimas',
      'Patvari medžiaga',
      'Įvairūs dydžiai'
    ],
    applications: [
      'Vandens paskirstymo sistemos',
      'Nuotekų sistemos',
      'Pramoninės instaliacijos',
      'Komunalinės paslaugos'
    ]
  },
  'elbow-45-fitting': {
    id: 'elbow-45-fitting',
    title: '45° alkūnė',
    description: 'HDPE 45° alkūnė lengvam vamzdynų krypties keitimui su minimaliu srauto pasipriešinimu.',
    image: elbow45,
    category: 'fittings',
    features: [
      'Optimali srauto dinamika',
      'Patikima jungtis',
      'Ilgaamžė medžiaga',
      'Suderinama su standartiniais vamzdžiais'
    ],
    applications: [
      'Kanalizacijos sistemos',
      'Vandens tiekimo sistemos',
      'Pramoninės sistemos',
      'Infrastruktūros projektai'
    ]
  },
  'tee-fitting': {
    id: 'tee-fitting',
    title: 'T formos jungtis',
    description: 'HDPE T formos jungtis atšakų kūrimui vamzdynų sistemose su puikiu struktūriniu vientisumu.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Trijų vamzdžių sujungimas',
      'Optimalus srauto paskirstymas',
      'Aukštos kokybės medžiaga',
      'Įvairūs dydžiai'
    ],
    applications: [
      'Vandens tiekimo sistemos',
      'Kanalizacijos tinklai',
      'Pramoniniai vamzdynai',
      'Nuotekų sistemos'
    ]
  },
  'flange-adapter': {
    id: 'flange-adapter',
    title: 'Jungės adapteris',
    description: 'HDPE jungės adapteris skirtingų vamzdynų sistemų sujungimui su patikimu hermetišku sandarinimu.',
    image: flangeAdapterShort,
    category: 'fittings',
    features: [
      'Universalus suderinamumas',
      'Vandeniui nepralaidus sujungimas',
      'Atsparus korozijai',
      'Paprastas montavimas'
    ],
    applications: [
      'Skirtingų sistemų integracija',
      'Remontas ir priežiūra',
      'Pramoninės instaliacijos',
      'Vandens tiekimo sistemos'
    ]
  },
  'hsaw-water-pipes': {
    id: 'hsaw-water-pipes',
    title: 'HSAW vamzdžiai vandens tiekimui',
    description: 'Spiralinio suvirinimo plieno vamzdžiai vandens transportavimui su puikiu atsparumu slėgiui ir ilgaamžiškumu.',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      'Didelis atsparumas slėgiui',
      'Spiralinio suvirinimo konstrukcija',
      'Apsauga nuo korozijos',
      'Didelis skersmuo'
    ],
    applications: [
      'Vandens magistralės',
      'Perdavimo linijos',
      'Infrastruktūros projektai',
      'Savivaldybių vandens tiekimas'
    ]
  },
  'polyethylene': {
    id: 'polyethylene',
    title: 'Polietileno produktai',
    description: 'Aukštos kokybės polietileno vamzdžiai ir jungtys vandens ir nuotekų sistemoms.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Lengvas ir patvarus',
      'Atsparus korozijai',
      'Lankstus naudojimas',
      'Ilgaamžis'
    ],
    applications: [
      'Vandens tiekimas',
      'Nuotekų sistemos',
      'Drenažo sistemos',
      'Pramoniniai tinklai'
    ]
  },
  'fittings': {
    id: 'fittings',
    title: 'Jungiamosios detalės',
    description: 'Įvairios jungiamosios detalės vamzdynų sistemų sujungimui ir konfigūravimui.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Aukštos kokybės medžiagos',
      'Įvairios konfigūracijos',
      'Patikimi sandarinimai',
      'Lengvas montavimas'
    ],
    applications: [
      'Vandens tiekimo sistemos',
      'Nuotekų sistemos',
      'Pramoniniai vamzdynai',
      'Komunaliniai tinklai'
    ]
  },
  'steel': {
    id: 'steel',
    title: 'Plieno produktai',
    description: 'Aukštos kokybės plieno vamzdžiai ir komponentai įvairiems taikymo atvejams.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Didelis tvirtumas',
      'Atsparumas aukštai temperatūrai',
      'Ilgaamžiškumas',
      'Atsparumas didelėms apkrovoms'
    ],
    applications: [
      'Naftos ir dujų pramonė',
      'Vandens perdavimas',
      'Konstrukcijų elementai',
      'Pramoniniai vamzdynai'
    ]
  },
  'cast-iron': {
    id: 'cast-iron',
    title: 'Ketaus Gaminiai',
    description: 'Platus ketaus gaminių asortimentas infrastruktūros ir statybos reikmėms su ilgaamžėmis savybėmis.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Didelis atsparumas ir tvirtumas',
      'Atsparumas korozijai',
      'Ilgas tarnavimo laikas',
      'Atitikimas Europos standartams'
    ],
    applications: [
      'Miesto infrastruktūra',
      'Vandens tiekimo sistemos',
      'Nuotekų sistemos',
      'Kelių statyba'
    ]
  },
  'aluminum': {
    id: 'aluminum',
    title: 'Aliuminio Gaminiai',
    description: 'Kokybiški aliuminio gaminiai įvairiems pramoniniams ir komerciniams poreikiams.',
    image: standardProfiles,
    category: 'aluminum',
    features: [
      'Lengva ir tvirta konstrukcija',
      'Atsparumas korozijai',
      'Įvairios formos ir dydžiai',
      'Ekologiška medžiaga'
    ],
    applications: [
      'Statyba',
      'Transporto pramonė',
      'Pramoniniai pritaikymai',
      'Architektūra ir dizainas'
    ]
  },
  'urban-infrastructure': {
    id: 'urban-infrastructure',
    title: 'Miesto Infrastruktūros Sprendimai',
    description: 'Miesto infrastruktūros sprendimai, akcentuojantys tvarumą ir funkcionalumą.',
    image: wellFacility,
    category: 'urban_infrastructure',
    features: [
      'Tvarios medžiagos',
      'Integruoti sprendimai',
      'Modernaus dizaino elementai',
      'Paprastas montavimas ir priežiūra'
    ],
    applications: [
      'Parkai ir poilsio zonos',
      'Miestų centrai',
      'Viešosios teritorijos',
      'Transporto infrastruktūra'
    ]
  },
  'drainage-channel': {
    id: 'drainage-channel',
    title: 'Drenažo Kanalai',
    description: 'Didelio atsparumo drenažo kanalai efektyviam vandens nuvedimui miesto ir pramoninėse teritorijose.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Didelis apkrovos atsparumas',
      'Efektyvus vandens nuvedimas',
      'Paprastas montavimas',
      'Lengva priežiūra ir valymas'
    ],
    applications: [
      'Gatvės ir keliai',
      'Automobilių stovėjimo aikštelės',
      'Pramoninės teritorijos',
      'Viešosios zonos'
    ]
  },
  'standard-profiles': {
    id: 'standard-profiles',
    title: 'Standartiniai aliuminio profiliai',
    description: 'Standartiniai aliuminio profiliai įvairiems pritaikymams statyboje, inžinerijoje ir dizaine su įvairiomis formomis ir dydžiais.',
    image: standardProfiles,
    category: 'aliuminis',
    features: [
      'Platus standartinių formų pasirinkimas',
      'Galimi įvairūs matmenys',
      'Aukštos kokybės apdaila',
      'Puikus stiprumo ir svorio santykis',
      'Ekonomiški sprendimai'
    ],
    applications: [
      'Baldų gamyba',
      'Interjero dizaino elementai',
      'Parodų sistemos',
      'Bendroji statyba',
      'Dekoratyviniai elementai'
    ],
    specifications: {
      'Medžiaga': 'Aliuminio lydinys EN AW-6060, EN AW-6063',
      'Lydinio būklė': 'T5, T6',
      'Paviršiaus apdaila': 'Neapdorota, anoduota, miltelinė danga',
      'Standartinis ilgis': '6000 mm (±10 mm)',
      'Gamybos metodas': 'Karštoji ekstruzija'
    }
  },
  
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: 'Mašinų gamybos profiliai',
    description: 'Specializuoti aliuminio profiliai pramoniniams ir mašinų gamybos pritaikymams su padidintu tikslumu ir tvirtumu.',
    image: machineProfiles,
    category: 'aliuminis',
    features: [
      'Didelis matmenų tikslumas',
      'Puikus stabilumas',
      'Modulinio sujungimo galimybė',
      'Griovelių konstrukcijos lengvam surinkimui',
      'Suderinamumas su pramoninėmis tvirtinimo sistemomis'
    ],
    applications: [
      'Mašinos ir įranga',
      'Automatizuotos sistemos',
      'Pramoniniai rėmai',
      'Gamybos linijos',
      'Robotika'
    ],
    specifications: {
      'Medžiaga': 'Aliuminio lydinys EN AW-6063, EN AW-6082',
      'Lydinio būklė': 'T5, T6',
      'Tikslumas': 'Aukštesnis nei standartinių profilių',
      'Matmenų diapazonas': 'Nuo 20x20 mm iki 80x80 mm',
      'Savybės': 'Įvairios griovelių sistemos (įskaitant T-griovelius)'
    }
  },
  
  'led-profiles': {
    id: 'led-profiles',
    title: 'LED apšvietimo profiliai',
    description: 'Specialūs aliuminio profiliai LED juostų montavimui ir integruotų apšvietimo sistemų kūrimui.',
    image: ledProfiles,
    category: 'aliuminis',
    features: [
      'Pasirenkami difuzoriai ir lęšiai',
      'Integruoti laidų kanalai',
      'Efektyvus šilumos valdymas',
      'Paslėptas montavimas',
      'Įvairios montavimo galimybės'
    ],
    applications: [
      'Namų apšvietimas',
      'Komercinis apšvietimas',
      'Baldų apšvietimas',
      'Architektūrinis apšvietimas',
      'Dekoratyviniai šviesos akcentai'
    ],
    specifications: {
      'Medžiaga': 'Aliuminio lydinys EN AW-6063',
      'Paviršius': 'Anoduotas, dažytas, neapdorotas',
      'Suderinamumas': 'Standartinės LED juostos 8-15 mm pločio',
      'Papildomi priedai': 'Antgaliai, laikikliai, difuzoriai, lęšiai',
      'Galimos spalvos': 'Sidabrinė, balta, juoda, ruda'
    }
  },
  
  'special-profiles': {
    id: 'special-profiles',
    title: 'Specialieji aliuminio profiliai',
    description: 'Aliuminio profiliai su nestandartine geometrija ir matmenimis konkrečioms pramonės šakoms ir specializuotiems pritaikymams.',
    image: specialProfiles,
    category: 'aliuminis',
    features: [
      'Pritaikytas dizainas',
      'Specializuotos funkcinės savybės',
      'Įvairios apdailos galimybės',
      'Integruoti sisteminiai sprendimai',
      'Galimybė gaminti mažomis partijomis'
    ],
    applications: [
      'Transporto pramonė',
      'Atsinaujinanti energija',
      'Šilumokaičiai',
      'Radiatoriai ir aušinimas',
      'Pritaikytos statybinės sistemos'
    ],
    specifications: {
      'Medžiaga': 'Įvairių serijų aliuminio lydiniai',
      'Dizainas': 'Pagal kliento specifikaciją arba pramonės standartus',
      'Apdaila': 'Pagal pritaikymo reikalavimus',
      'Ilgis': 'Standartinis 6m arba pagal specifikaciją',
      'Minimalus užsakymas': 'Priklauso nuo profilio sudėtingumo'
    }
  },
  
  // Categories in Lithuanian
  'waste-box': {
    id: 'waste-box',
    title: 'Miesto atliekų surinkimo dėžė',
    description: 'Moderni, patvari atliekų surinkimo dėžė miesto aplinkai su ergonomišku dizainu ir atsparumu oro sąlygoms.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Atspari oro sąlygoms konstrukcija',
      'Ergonomiškas atidarymo mechanizmas',
      'Lengva ištuštinimo sistema',
      'Atsparus kenkėjams dizainas',
      'UV stabilizuotos medžiagos'
    ],
    applications: [
      'Miesto gatvės ir parkai',
      'Autobusų stotelės ir tranzito stotys',
      'Komercinės zonos',
      'Švietimo įstaigos',
      'Poilsio įrenginiai'
    ],
    specifications: {
      'Medžiaga': 'Didelio atsparumo smūgiams polietilenas su metalo rėmu',
      'Talpa': '30 litrų',
      'Matmenys': '400×300×700mm',
      'Montavimas': 'Paviršinio montavimo arba stulpinio montavimo parinktys',
      'Funkcijos': 'Cigarečių gesintuvas, perdirbimo galimybės',
      'Spalva': 'Įvairios savivaldybių spalvų parinktys'
    }
  },
  
  // Categories in Lithuanian
  'urban infrastructure': {
    id: 'urban infrastructure',
    title: 'Miesto infrastruktūra',
    description: 'Miesto infrastruktūros produktai',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [],
    applications: []
  },
  
  // Infrastructure products in Lithuanian
  'rainwater-grill-d400-standard': {
    id: 'rainwater-grill-d400-standard',
    title: 'Lietaus vandens grotelės D400',
    description: 'Sunkiajai apkrovai skirtos D400 lietaus vandens grotelės, sukurtos drenažui intensyvaus eismo zonose, tokiose kaip keliai ir komercinės zonos.',
    image: rainwaterGrillD400,
    category: 'cast_iron',
    features: [
      'Tvirta ketaus konstrukcija',
      'D400 apkrovos klasifikacija (40 tonų)',
      'Optimizuotas vandens srauto dizainas',
      'Apsauga nuo užsikimšimo',
      'Saugios montavimo galimybės'
    ],
    applications: [
      'Kelių drenavimo sistemos',
      'Miesto infrastruktūra',
      'Komercinės zonos',
      'Pramoninės teritorijos',
      'Automobilių stovėjimo aikštelės'
    ],
    specifications: {
      'Medžiaga': 'Ketus GGG50/GJS-500-7',
      'Standartas': 'EN 124',
      'Apkrovos klasė': 'D400 (40 tonų)',
      'Danga': 'Juoda bitumo dažų danga',
      'Matmenys': '600×600mm (vidinis plotis)',
      'Svoris': 'Apie 55-65 kg'
    }
  },
  'rainwater-grill-d400-2': {
    id: 'rainwater-grill-d400-2',
    title: 'Lietaus vandens grotelės Premium D400',
    description: 'Aukštos kokybės D400 lietaus vandens grotelės su patobulintu dizainu ir padidintu vandens pralaidumu.',
    image: rainwaterGrillD4002,
    category: 'cast_iron',
    features: [
      'Inovatyvus grotelių dizainas',
      'Padidintas vandens pralaidumas',
      'Sustiprintos ketaus konstrukcijos',
      'Pagerinta paviršiaus apdaila',
      'Triukšmą slopinanti konstrukcija'
    ],
    applications: [
      'Intensyvaus eismo keliai',
      'Greitkeliai',
      'Miestų centrai',
      'Pramoninės zonos',
      'Aikštės ir automobilių stovėjimo aikštelės'
    ],
    specifications: {
      'Medžiaga': 'Ketus GGG50/GJS-500-7',
      'Standartas': 'EN 124',
      'Apkrovos klasė': 'D400 (40 tonų)',
      'Danga': 'Premium juoda bitumo dažų danga',
      'Matmenys': '600×600mm (vidinis plotis)',
      'Funkcijos': 'Apsaugos nuo vagysčių sistema'
    }
  },
  'rainwater-grill-meria': {
    id: 'rainwater-grill-meria',
    title: 'Lietaus vandens grotelės MERIA serija',
    description: 'Premium MERIA dizaino lietaus vandens grotelės moderniems miestų kraštovaizdžiams, derinančios funkcionalumą su estetiniu patrauklumu.',
    image: rainwaterGrillMeria,
    category: 'cast_iron',
    features: [
      'Išskirtinis MERIA rašto dizainas',
      'D400 apkrovos klasė (40 tonų)',
      'Puikus hidraulinis efektyvumas',
      'Pagerintas atsparumas slydimui',
      'Architektūrinės kokybės apdaila'
    ],
    applications: [
      'Miestų centrai ir viešosios aikštės',
      'Pėstiesiems draugiškos miestų zonos',
      'Komerciniai rajonai',
      'Istorinės zonos',
      'Premium kraštovaizdžio zonos'
    ],
    specifications: {
      'Medžiaga': 'Ketus GGG50/GJS-500-7',
      'Standartas': 'EN 124',
      'Apkrovos klasė': 'D400 (40 tonų)',
      'Danga': 'Premium juoda bitumo dažų danga',
      'Matmenys': '500×500mm (vidinis plotis)',
      'Funkcijos': 'Apsaugos nuo vagysčių sistema'
    }
  },
  'rainwater-grill-f900': {
    id: 'rainwater-grill-f900',
    title: 'Lietaus vandens grotelės F900 sunkiajai apkrovai',
    description: 'Ultra sunkios apkrovos F900 lietaus vandens grotelės, skirtos ypatingai didelėms apkrovoms pramoninėje ir uosto aplinkoje.',
    image: rainwaterGrillF900,
    category: 'cast_iron',
    features: [
      'Maksimali apkrovos galia F900 (90 tonų)',
      'Sustiprinta struktūrinė konstrukcija',
      'Pramoninės kokybės patvarumas',
      'Didelis pralaidumas',
      'Atsparumas ekstremalioms sąlygoms'
    ],
    applications: [
      'Oro uostų pakilimo takai ir riedėjimo takai',
      'Konteinerių terminalai ir uostai',
      'Sunkiosios pramonės zonos',
      'Logistikos centrai',
      'Kariniai objektai'
    ],
    specifications: {
      'Medžiaga': 'Aukštos kokybės ketus GGG60',
      'Standartas': 'EN 124',
      'Apkrovos klasė': 'F900 (90 tonų)',
      'Danga': 'Sustiprintas apsauginis padengimas nuo korozijos',
      'Matmenys': 'Įvairūs pramoniniai matmenys',
      'Montavimas': 'Reikalingas specialus aukštos kokybės pagrindas'
    }
  },
  'ground-fire-hydrant-lt': {
    id: 'ground-fire-hydrant',
    title: 'Požeminis gaisrinis hidrantas',
    description: 'Požeminė gaisrinių hidrantų sistema, užtikrinanti efektyvią prieigą prie vandens gaisro atveju miestų ir pramoniniuose rajonuose.',
    image: groundFireHydrant,
    category: 'fire-protection',
    features: [
      'Greita prieiga',
      'Saugi eismui požeminė konstrukcija',
      'Apsaugota nuo užšalimo vožtuvų sistema',
      'Automatinio drenavimo galimybė',
      'Standartinė jungčių sąsaja'
    ],
    applications: [
      'Miestų priešgaisrinės apsaugos tinklai',
      'Komerciniai rajonai',
      'Pramoninės zonos',
      'Oro uostai ir transporto mazgai',
      'Instituciniai pastatai'
    ],
    specifications: {
      'Medžiaga': 'Ketus su nerūdijančio plieno komponentais',
      'Darbinis slėgis': 'PN16',
      'Gylis': 'Reguliuojamas pagal įšalo liniją',
      'Jungtys': 'Standartinės priešgaisrinės jungtys',
      'Atitiktis': 'EN 14339, GOST'
    }
  },
  'gate-valve': {
    id: 'gate-valve',
    title: 'Ketaus sklendė',
    description: 'Ketaus sklendės vandens tiekimo sistemoms ir pramoniniam naudojimui su puikiu sandarinimu ir ilgu tarnavimo laiku.',
    image: gateValve,
    category: 'valves',
    features: [
      'Tvirta ketaus konstrukcija',
      'Slėgio klasės PN10-16',
      'Paprasta eksploatacija ir priežiūra',
      'Visiškas srauto uždarymas',
      'Ilgas tarnavimo laikas'
    ],
    applications: [
      'Vandens tiekimo sistemos',
      'Vandens valymo įrenginiai',
      'Pramoniniai procesai',
      'Paskirstymo tinklai',
      'Priešgaisrinės sistemos'
    ],
    specifications: {
      'Korpuso medžiaga': 'Ketus GG25/GJL-250',
      'Veleno medžiaga': 'Nerūdijantis plienas',
      'Darbinis slėgis': 'PN10-16',
      'Matmenys': 'DN50-500',
      'Temperatūra': 'nuo -10°C iki +120°C',
      'Valdymas': 'Rankinis su elektrinės pavaros galimybe'
    }
  },
  'hdpe-pipes-lt': {
    id: 'hdpe-pipes',
    title: 'HDPE vamzdžiai (PE100)',
    description: 'Didelio tankio polietileno vamzdžiai vandens, dujų ir kanalizacijos sistemoms.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Puikus atsparumas chemikalams',
      'Ilgas tarnavimo laikas (50+ metų)',
      'Lankstūs ir lengvi',
      'Atsparūs korozijai',
      'Mažos priežiūros išlaidos'
    ],
    applications: [
      'Geriamojo vandens tiekimas',
      'Kanalizacijos sistemos',
      'Dujotiekiai',
      'Pramoninių skysčių transportavimas',
      'Drenavimo sistemos'
    ],
    specifications: {
      'Medžiaga': 'PE100 didelio tankio polietilenas',
      'Standartai': 'EN 12201, ISO 4427',
      'Skersmuo': 'nuo 20mm iki 2000mm',
      'Slėgio klasė': 'PN6.3 iki PN25',
      'Jungtys': 'Elektrofuzija, kontaktinis suvirinimas, mechaninės jungtys'
    }
  },
  'steel-pipes-water': {
    id: 'steel-pipes-water',
    title: 'Spiraliniai suvirinimo plieno vamzdžiai',
    description: 'Didelio stiprumo spiraliniai suvirinimo plieno vamzdžiai didelio skersmens vandens tiekimo, kanalizacijos ir pramoninėms reikmėms.',
    image: hsawPilesWater, // Using the Helical Submerged Arc Welded Pipes image
    category: 'steel',
    features: [
      'Aukštas struktūrinis vientisumas',
      'Didelio skersmens sprendimai',
      'Pritaikomi matmenys ir ilgiai',
      'Vidinė ir išorinė danga',
      'Didelis atsparumas slėgiui'
    ],
    applications: [
      'Komunaliniai vandens vamzdynai',
      'Lietaus vandens ir kanalizacijos sistemos',
      'Pramoninės vandens sistemos',
      'Hidroelektrinių vandens tiekimo linijos',
      'Geriamojo vandens transportavimas'
    ],
    specifications: {
      'Medžiaga': 'Anglinis plienas',
      'Standartai': 'EN 10217, AWWA C200',
      'Skersmuo': 'nuo 406mm iki 2540mm',
      'Sienelių storis': 'nuo 4mm iki 20mm',
      'Danga': 'Epoksidinė, cementinė danga, PE, PP arba pagal specifikaciją'
    }
  },
  'manhole-cover-d400': {
    id: 'manhole-cover-d400',
    title: 'Ketaus kanalizacijos šulinių dangčiai D400',
    description: 'Didelio stiprumo ketaus kanalizacijos šulinių dangčiai intensyvaus eismo zonoms su saugumo ir triukšmo mažinimo funkcijomis.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'D400 apkrovos klasė (40 tonų)',
      'Triukšmą slopinanti konstrukcija',
      'Galimos ventiliacijos angos',
      'Apsaugos nuo vagysčių mechanizmas',
      'Paprastas montavimas ir priežiūra'
    ],
    applications: [
      'Miesto gatvės ir keliai',
      'Automobilių stovėjimo aikštelės ir komercinės zonos',
      'Pramoninės teritorijos',
      'Gamybos objektai',
      'Logistikos centrai'
    ],
    specifications: {
      'Medžiaga': 'Ketus GGG50/GJS-500-7',
      'Standartas': 'EN 124',
      'Vidinis plotis': '600mm arba pagal specifikaciją',
      'Bendras aukštis': 'nuo 100mm iki 160mm',
      'Rėmo dydis': '850mm x 850mm (standartinis)'
    }
  },
  // Aluminum products in Lithuanian
  'structural-aluminum': {
    id: 'structural-aluminum',
    title: 'Struktūrinis aliuminis',
    description: 'Didelio stiprumo aliuminio profiliai, skirti struktūrinėms konstrukcijoms statybos ir pramonės sektoriuose.',
    image: standardProfiles, // Using aluminum u-profiles image
    category: 'aluminum',
    features: [
      'Didelis stiprumo ir svorio santykis',
      'Puikus atsparumas korozijai',
      'Matmenų stabilumas',
      'Geras šilumos laidumas',
      'Nemagnetinės savybės'
    ],
    applications: [
      'Pramonės rėmai ir konstrukcijos',
      'Statybiniai karkasai',
      'Modulinės statybos sistemos',
      'Komercinės konstrukcijos',
      'Infrastruktūros projektai'
    ],
    specifications: {
      'Lydinio tipas': '6000 serija (6061, 6063, 6082)',
      'Grūdinimas': 'T5, T6',
      'Takumo riba': '240-260 MPa',
      'Tempimo stiprumas': '290-310 MPa',
      'Paviršiaus apdorojimas': 'Gamyklinis apdorojimas, anodavimas, miltelinis dažymas'
    }
  },
  'architectural-aluminum': {
    id: 'architectural-aluminum',
    title: 'Architektūrinis aliuminis',
    description: 'Aukščiausios kokybės aliuminio profiliai fasadams, langams ir dekoratyviniams architektūriniams elementams.',
    image: tProfiles, // Using aluminum t-profiles image
    category: 'aluminum',
    features: [
      'Estetiškai patrauklus išvaizdą',
      'Platus apdailos ir spalvų pasirinkimas',
      'Atsparumas oro sąlygoms',
      'Ilgaamžiškumas ir mažas priežiūros poreikis',
      'Puikios formavimo galimybės'
    ],
    applications: [
      'Fasadų sistemos',
      'Langų ir durų rėmai',
      'Dekoratyviniai pastatų elementai',
      'Apsaugos nuo saulės ekranai ir žaliuzės',
      'Vidinės pertvaros'
    ],
    specifications: {
      'Lydinio tipas': '6000 serija (daugiausia 6063)',
      'Grūdinimas': 'T5, T6',
      'Apdailos variantai': 'Anodavimas, miltelinis dažymas, medžio imitacija',
      'Spalvų variantai': 'Pagal RAL katalogą',
      'Sienelės storis': '1.2-3.0 mm'
    }
  },
  'industrial-aluminum': {
    id: 'industrial-aluminum',
    title: 'Pramoninis aliuminis',
    description: 'Specializuoti aliuminio profiliai gamybai, mašinų komponentams ir pramoniniams taikymams.',
    image: ledProfiles, // Using LED profiles image for industrial applications
    category: 'aluminum',
    features: [
      'Didelis matmenų tikslumas',
      'Puikus apdirbamumas',
      'Konstrukcinis lankstumas',
      'Atsparumas ekstremalioms sąlygoms',
      'Geras elektros laidumas'
    ],
    applications: [
      'Automatizuota įranga',
      'Konvejerio sistemos',
      'Pramoniniai rėmai',
      'Elektros korpusai',
      'Radiatoriai ir šilumokaičiai'
    ],
    specifications: {
      'Lydinio tipas': '6000 ir 7000 serijos',
      'Tolerancijos': 'Atitinka DIN/ISO standartus',
      'Paviršiaus apdorojimas': 'Anodavimas, pasyvacija',
      'Jungimo metodai': 'T-grioveliai, tvirtinimo detalės ir jungtys',
      'Moduliškumas': 'Suderinamumas su pramonės standartais'
    }
  },
  'custom-aluminum': {
    id: 'custom-aluminum',
    title: 'Individualūs sprendimai',
    description: 'Pagal užsakymą pagaminti aliuminio profilių sprendimai, skirti patenkinti konkrečius projekto reikalavimus.',
    image: specialProfiles, // Using special aluminum profile image showing custom extrusions
    category: 'aluminum',
    features: [
      'Projektavimas pagal kliento specifikacijas',
      'Formos optimizavimas konkrečiam pritaikymui',
      'Specialūs lydiniai ypatingiems reikalavimams',
      'Individualios mechaninės savybės',
      'Nestandartiniai matmenys ir formos'
    ],
    applications: [
      'Specializuota transporto įranga',
      'Unikalūs statybiniai elementai',
      'Kosmoso komponentai',
      'Jūriniai pritaikymai',
      'Specialios pramoninės mašinos'
    ],
    specifications: {
      'Lydinio tipas': 'Pasirenkamas pagal reikalavimus',
      'Gamybos procesas': 'CNC ekstruzija, frezavimas, precizinis apdirbimas',
      'Dokumentacija': 'Išsami techninė dokumentacija ir sertifikatai',
      'Prototipų kūrimas': 'Galimas greitas prototipų kūrimas',
      'Minimalus užsakymas': 'Lanksčios sąlygos specialiems projektams'
    }
  },
  
  // Infrastructure products translations - Lithuanian
  'rainwater-grill-d400': {
    id: 'rainwater-grill-d400',
    title: 'Lietaus vandens grotelės D400',
    description: 'Tvirtos konstrukcijos D400 lietaus vandens grotelės, skirtos vandens nutekėjimui intensyvaus eismo zonose.',
    image: 'Rainwater grill D400 1 .png',
    category: 'cast_iron',
    features: [
      'Didelis apkrovos atsparumas iki D400 (40 tonų)',
      'Kelių eismo dizainas',
      'Neslystantis paviršius',
      'Lengvai montuojamos ir prižiūrimos'
    ],
    applications: [
      'Gatvės ir keliai',
      'Automobilių stovėjimo aikštelės',
      'Komerciniai ir pramoniniai objektai',
      'Miesto aplinka'
    ],
    specifications: {
      'Medžiaga': 'Ketaus rėmas ir grotelės',
      'Apkrovos klasifikacija': 'D400 pagal EN 124',
      'Matmenys': '600 x 600 mm (standartinis dydis)',
      'Apdaila': 'Juoda bituminė arba miltelinė danga'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: 'Kanalizacijos šulinių dangčiai ir rėmai',
    description: 'Tvirti ketaus kanalizacijos šulinių dangčiai ir rėmai miesto infrastruktūrai su įvairiomis apkrovos klasėmis.',
    image: 'Circular manhole cover (С250)K H80 .png',
    category: 'cast_iron',
    features: [
      'Galimos įvairios apkrovos klasės: B125, C250, D400',
      'Su vyriais arba be vyrių konstrukcija',
      'Fiksavimo mechanizmas saugumui užtikrinti',
      'Triukšmą mažinanti konstrukcija'
    ],
    applications: [
      'Gatvės ir keliai',
      'Šaligatviai',
      'Pėsčiųjų zonos',
      'Kanalizacijos sistemos'
    ],
    specifications: {
      'Medžiaga': 'Aukštos kokybės pilkas ketus',
      'Apkrovos klasifikacija': 'Nuo B125 iki D400',
      'Skersmuo': '600mm, 800mm, 1000mm (standartiniai dydžiai)',
      'Aukštis': '80mm iki 150mm, priklausomai nuo klasės'
    }
  },
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: 'HDPE vamzdžiai (PE100)',
    description: 'Didelio tankio polietileno vamzdžiai su puikiu atsparumu chemikalams, skirti vandens tiekimo, dujų ir nuotekų sistemoms.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Puikus cheminis atsparumas',
      'Ilgas tarnavimo laikas (50+ metų)',
      'Lankstūs ir lengvi',
      'Atsparūs korozijai',
      'Mažos priežiūros išlaidos'
    ],
    applications: [
      'Geriamojo vandens tiekimas',
      'Nuotekų sistemos',
      'Dujotiekiai',
      'Pramoninių skysčių transportavimas',
      'Drenažo sistemos'
    ],
    specifications: {
      'Medžiaga': 'PE100 didelio tankio polietilenas',
      'Standartai': 'EN 12201, ISO 4427',
      'Skersmenys': '20mm iki 2000mm',
      'Slėgio klasė': 'PN6.3 iki PN25',
      'Jungtys': 'Elektrofuzinis suvirinimas, sandūrinis suvirinimas, mechaninės jungtys'
    }
  },
  'gate-valve-lt': {
    id: 'gate-valve',
    title: 'Sklendė',
    description: 'Ketaus sklendės vandens tiekimo sistemoms ir pramoniniam naudojimui su puikiu sandarinimu ir ilgu tarnavimo laiku.',
    image: gateValve,
    category: 'valves',
    features: [
      'Visiška pralaida atidarytoje padėtyje',
      'Mažas slėgio praradimas',
      'Ilgalaikis sandarumas',
      'Dvikryptė srauto kontrolė'
    ],
    applications: [
      'Vandens tiekimo sistemos',
      'Nuotekų sistemos',
      'Pramoninės sistemos',
      'Drėkinimo sistemos'
    ],
    specifications: {
      'Medžiaga': 'Pilko ketaus korpusas, nerūdijančio plieno velenas',
      'Dydis': 'DN50-DN500',
      'Slėgio klasė': 'PN10-PN16',
      'Jungtis': 'Flanšinė pagal EN 1092-2'
    }
  },
  'ground-fire-hydrant': {
    id: 'ground-fire-hydrant',
    title: 'Antžeminis priešgaisrinis hidrantas',
    description: 'Gerai matomas antžeminis priešgaisrinis hidrantas greitam vandens tiekimo pasiekimui ekstremalių situacijų metu.',
    image: 'Ground fire hydrant .png',
    category: 'fire-protection',
    features: [
      'Automatinis drenažo vožtuvas, apsaugantis nuo užšalimo',
      'Gerai matoma raudona spalva',
      'Atsparus korozijai',
      'Greito aktyvavimo sistema'
    ],
    applications: [
      'Miesto priešgaisrinė infrastruktūra',
      'Pramoniniai objektai',
      'Prekybos centrai',
      'Gyvenamieji kompleksai',
      'Oro uostai ir transporto terminalai'
    ],
    specifications: {
      'Medžiaga': 'Padengtas ketaus korpusas',
      'Jungtis': 'Flanšinė jungtis DN80-100',
      'Darbinis slėgis': 'PN16',
      'Išvadai': '2-3 išvadai (Storz)',
      'Aukštis': '750-1500mm',
      'Aktyvavimas': 'Hidranto raktas'
    }
  }
};

// Polish language product details
const plProductDetailsMap: Record<string, ProductDetails> = {
  // Aluminum products in Polish
  
  // Add missing category entries for Polish
  
  // Missing fitting products for Polish
  'corrugated-pipes': {
    id: 'corrugated-pipes',
    title: 'Rury karbowane dwuścienne',
    description: 'Rury karbowane dwuścienne z gładką wewnętrzną powierzchnią do systemów odprowadzania wody i kanalizacji.',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      'Wysoka odporność na odkształcenia',
      'Doskonałe właściwości hydrauliczne',
      'Łatwy montaż',
      'Długi okres użytkowania'
    ],
    applications: [
      'Kolektory wód deszczowych',
      'Systemy kanalizacyjne',
      'Systemy drenażowe',
      'Budownictwo drogowe'
    ]
  },
  'reinforced-pipe': {
    id: 'reinforced-pipe',
    title: 'Rury PE wzmocnione stalą',
    description: 'Rury polietylenowe ze wzmocnieniem stalowym do dużych obciążeń i ekstremalnych warunków.',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      'Solidna konstrukcja ze wzmocnieniem stalowym',
      'Wysoka odporność na ciśnienie',
      'Odporność na odkształcenia',
      'Odporność chemiczna'
    ],
    applications: [
      'Rurociągi o dużej średnicy',
      'Instalacje podziemne',
      'Systemy przemysłowe',
      'Warunki dużego obciążenia'
    ]
  },
  'elbow-fitting': {
    id: 'elbow-fitting',
    title: 'Kolano 90°',
    description: 'Kolano HDPE 90° do zmiany kierunku rurociągu z optymalną przepustowością przepływu.',
    image: elbow90,
    category: 'fittings',
    features: [
      'Jednolita konstrukcja',
      'Łatwa instalacja',
      'Trwały materiał',
      'Różne rozmiary'
    ],
    applications: [
      'Systemy dystrybucji wody',
      'Systemy ściekowe',
      'Instalacje przemysłowe',
      'Usługi komunalne'
    ]
  },
  'elbow-45-fitting': {
    id: 'elbow-45-fitting',
    title: 'Kolano 45°',
    description: 'Kolano HDPE 45° do łatwej zmiany kierunku rurociągu z minimalnym oporem przepływu.',
    image: elbow45,
    category: 'fittings',
    features: [
      'Optymalna dynamika przepływu',
      'Niezawodne połączenie',
      'Długotrwały materiał',
      'Kompatybilność ze standardowymi rurami'
    ],
    applications: [
      'Systemy kanalizacyjne',
      'Systemy wodociągowe',
      'Systemy przemysłowe',
      'Projekty infrastrukturalne'
    ]
  },
  'tee-fitting': {
    id: 'tee-fitting',
    title: 'Trójnik',
    description: 'Trójnik HDPE do tworzenia odgałęzień w systemach rurociągowych z doskonałą integralnością strukturalną.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Łączenie trzech rur',
      'Optymalny rozkład przepływu',
      'Materiał wysokiej jakości',
      'Dostępne różne rozmiary'
    ],
    applications: [
      'Systemy wodociągowe',
      'Sieci kanalizacyjne',
      'Rurociągi przemysłowe',
      'Systemy ściekowe'
    ]
  },
  'flange-adapter': {
    id: 'flange-adapter',
    title: 'Adapter kołnierzowy',
    description: 'Adapter kołnierzowy HDPE do łączenia różnych systemów rurociągowych z niezawodnym uszczelnieniem hermetycznym.',
    image: flangeAdapterShort,
    category: 'fittings',
    features: [
      'Uniwersalna kompatybilność',
      'Wodoszczelne połączenie',
      'Odporność na korozję',
      'Łatwa instalacja'
    ],
    applications: [
      'Integracja różnych systemów',
      'Naprawa i konserwacja',
      'Instalacje przemysłowe',
      'Systemy wodociągowe'
    ]
  },
  'hsaw-water-pipes': {
    id: 'hsaw-water-pipes',
    title: 'Rury HSAW do wodociągów',
    description: 'Spiralnie spawane rury stalowe do transportu wody z doskonałą odpornością na ciśnienie i długą żywotnością.',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      'Wysoka odporność na ciśnienie',
      'Konstrukcja spawana spiralnie',
      'Ochrona antykorozyjna',
      'Duża średnica'
    ],
    applications: [
      'Magistrale wodne',
      'Linie przesyłowe',
      'Projekty infrastrukturalne',
      'Wodociągi miejskie'
    ]
  },
  'polyethylene': {
    id: 'polyethylene',
    title: 'Produkty polietylenowe',
    description: 'Wysokiej jakości rury i kształtki polietylenowe do systemów wodociągowych i kanalizacyjnych.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Lekki i wytrzymały',
      'Odporny na korozję',
      'Elastyczne zastosowanie',
      'Długa żywotność'
    ],
    applications: [
      'Dostawy wody',
      'Systemy ściekowe',
      'Systemy drenażowe',
      'Sieci przemysłowe'
    ]
  },
  'fittings': {
    id: 'fittings',
    title: 'Kształtki',
    description: 'Różne kształtki do łączenia i konfigurowania systemów rurociągowych.',
    image: equalTee,
    category: 'fittings',
    features: [
      'Materiały wysokiej jakości',
      'Różne konfiguracje',
      'Niezawodne uszczelnienia',
      'Łatwy montaż'
    ],
    applications: [
      'Systemy wodociągowe',
      'Systemy ściekowe',
      'Rurociągi przemysłowe',
      'Sieci komunalne'
    ]
  },
  'steel': {
    id: 'steel',
    title: 'Produkty stalowe',
    description: 'Wysokiej jakości rury stalowe i komponenty do różnych zastosowań.',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      'Duża wytrzymałość',
      'Odporność na wysokie temperatury',
      'Długotrwała trwałość',
      'Odporność na duże obciążenia'
    ],
    applications: [
      'Przemysł naftowy i gazowniczy',
      'Transport wody',
      'Elementy konstrukcyjne',
      'Rurociągi przemysłowe'
    ]
  },
  'cast-iron': {
    id: 'cast-iron',
    title: 'Wyroby z Żeliwa',
    description: 'Szeroka gama wyrobów z żeliwa do zastosowań infrastrukturalnych i budowlanych o długiej żywotności.',
    image: manholeD400,
    category: 'cast_iron',
    features: [
      'Wysoka wytrzymałość i trwałość',
      'Odporność na korozję',
      'Długa żywotność',
      'Zgodność z normami europejskimi'
    ],
    applications: [
      'Infrastruktura miejska',
      'Systemy wodociągowe',
      'Systemy kanalizacyjne',
      'Budownictwo drogowe'
    ]
  },
  'aluminum': {
    id: 'aluminum',
    title: 'Wyroby Aluminiowe',
    description: 'Wysokiej jakości wyroby aluminiowe do różnych zastosowań przemysłowych i komercyjnych.',
    image: standardProfiles,
    category: 'aluminum',
    features: [
      'Lekka i wytrzymała konstrukcja',
      'Odporność na korozję',
      'Różnorodne kształty i rozmiary',
      'Przyjazny dla środowiska materiał'
    ],
    applications: [
      'Budownictwo',
      'Sektor transportu',
      'Zastosowania przemysłowe',
      'Architektura i design'
    ]
  },
  'urban-infrastructure': {
    id: 'urban-infrastructure',
    title: 'Rozwiązania Infrastruktury Miejskiej',
    description: 'Rozwiązania infrastruktury miejskiej z naciskiem na zrównoważony rozwój i funkcjonalność.',
    image: wellFacility,
    category: 'urban_infrastructure',
    features: [
      'Zrównoważone materiały',
      'Zintegrowane rozwiązania',
      'Elementy nowoczesnego designu',
      'Łatwa instalacja i konserwacja'
    ],
    applications: [
      'Parki i strefy rekreacyjne',
      'Centra miast',
      'Tereny publiczne',
      'Infrastruktura transportowa'
    ]
  },
  'drainage-channel': {
    id: 'drainage-channel',
    title: 'Kanały Odwadniające',
    description: 'Kanały odwadniające o wysokiej wytrzymałości do efektywnego odprowadzania wody w obszarach miejskich i przemysłowych.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Wysoka odporność na obciążenia',
      'Efektywne odprowadzanie wody',
      'Łatwa instalacja',
      'Prosta konserwacja i czyszczenie'
    ],
    applications: [
      'Ulice i drogi',
      'Parkingi',
      'Tereny przemysłowe',
      'Strefy publiczne'
    ]
  },
  'standard-profiles': {
    id: 'standard-profiles',
    title: 'Standardowe profile aluminiowe',
    description: 'Standardowe profile aluminiowe do wszechstronnych zastosowań w budownictwie, inżynierii i projektowaniu o różnych kształtach i rozmiarach.',
    image: standardProfiles,
    category: 'aluminium',
    features: [
      'Szeroki zakres standardowych kształtów',
      'Dostępne w wielu wymiarach',
      'Wykończenie wysokiej jakości',
      'Doskonały stosunek wytrzymałości do wagi',
      'Ekonomiczne rozwiązania'
    ],
    applications: [
      'Produkcja mebli',
      'Elementy wystroju wnętrz',
      'Systemy wystawiennicze',
      'Budownictwo ogólne',
      'Elementy dekoracyjne'
    ],
    specifications: {
      'Materiał': 'Stop aluminium EN AW-6060, EN AW-6063',
      'Stan stopu': 'T5, T6',
      'Wykończenie powierzchni': 'Surowe, anodowane, malowane proszkowo',
      'Standardowa długość': '6000 mm (±10 mm)',
      'Metoda produkcji': 'Wytłaczanie na gorąco'
    }
  },
  
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: 'Profile do budowy maszyn',
    description: 'Specjalistyczne profile aluminiowe do zastosowań przemysłowych i budowy maszyn o zwiększonej precyzji i wytrzymałości.',
    image: machineProfiles,
    category: 'aluminium',
    features: [
      'Wysoka precyzja wymiarowa',
      'Doskonała stabilność',
      'Możliwość modułowego łączenia',
      'Konstrukcje rowkowe do łatwego montażu',
      'Kompatybilność z przemysłowymi systemami mocowania'
    ],
    applications: [
      'Maszyny i urządzenia',
      'Systemy zautomatyzowane',
      'Ramy przemysłowe',
      'Linie produkcyjne',
      'Robotyka'
    ],
    specifications: {
      'Materiał': 'Stop aluminium EN AW-6063, EN AW-6082',
      'Stan stopu': 'T5, T6',
      'Precyzja': 'Wyższa niż w standardowych profilach',
      'Zakres wymiarów': 'Od 20x20 mm do 80x80 mm',
      'Cechy': 'Różne systemy rowków (w tym rowki T)'
    }
  },
  
  'led-profiles': {
    id: 'led-profiles',
    title: 'Profile LED do oświetlenia',
    description: 'Specjalne profile aluminiowe do montażu taśm LED i tworzenia zintegrowanych systemów oświetleniowych.',
    image: ledProfiles,
    category: 'aluminium',
    features: [
      'Opcjonalne dyfuzory i soczewki',
      'Zintegrowane kanały przewodowe',
      'Efektywne zarządzanie ciepłem',
      'Ukryty montaż',
      'Różne opcje instalacji'
    ],
    applications: [
      'Oświetlenie domowe',
      'Oświetlenie komercyjne',
      'Podświetlenie mebli',
      'Oświetlenie architektoniczne',
      'Dekoracyjne akcenty świetlne'
    ],
    specifications: {
      'Materiał': 'Stop aluminium EN AW-6063',
      'Powierzchnia': 'Anodowana, malowana, surowa',
      'Kompatybilność': 'Standardowe taśmy LED o szerokości 8-15 mm',
      'Opcjonalne akcesoria': 'Zaślepki, uchwyty, dyfuzory, soczewki',
      'Dostępne kolory': 'Srebrny, biały, czarny, brązowy'
    }
  },
  
  'special-profiles': {
    id: 'special-profiles',
    title: 'Specjalne profile aluminiowe',
    description: 'Profile aluminiowe o niestandardowej geometrii i wymiarach do konkretnych zastosowań branżowych i specjalistycznych.',
    image: specialProfiles,
    category: 'aluminium',
    features: [
      'Niestandardowy design',
      'Specjalistyczne funkcje',
      'Różne opcje wykończenia',
      'Zintegrowane rozwiązania systemowe',
      'Możliwość produkcji małych partii'
    ],
    applications: [
      'Przemysł transportowy',
      'Energia odnawialna',
      'Wymienniki ciepła',
      'Radiatory i chłodzenie',
      'Niestandardowe systemy budowlane'
    ],
    specifications: {
      'Materiał': 'Stopy aluminium różnych serii',
      'Projekt': 'Według specyfikacji klienta lub standardów branżowych',
      'Wykończenie': 'Zgodnie z wymaganiami aplikacji',
      'Długość': 'Standardowo 6m lub według specyfikacji',
      'Minimalne zamówienie': 'Zależne od złożoności profilu'
    }
  },
  
  // Categories in Polish
  'waste-box': {
    id: 'waste-box',
    title: 'Kosz na odpady miejskie',
    description: 'Nowoczesny, wytrzymały kosz na odpady do środowisk miejskich, o ergonomicznej konstrukcji i odporności na warunki atmosferyczne.',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [
      'Odporna na warunki atmosferyczne konstrukcja',
      'Ergonomiczny mechanizm otwierania',
      'Łatwy system opróżniania',
      'Konstrukcja odporna na szkodniki',
      'Materiały stabilizowane UV'
    ],
    applications: [
      'Ulice i parki miejskie',
      'Przystanki autobusowe i stacje tranzytowe',
      'Obszary komercyjne',
      'Instytucje edukacyjne',
      'Obiekty rekreacyjne'
    ],
    specifications: {
      'Materiał': 'Polietylen o wysokiej odporności na uderzenia z ramą metalową',
      'Pojemność': '30 litrów',
      'Wymiary': '400×300×700mm',
      'Montaż': 'Opcje montażu powierzchniowego lub na słupku',
      'Funkcje': 'Gaszarka do papierosów, opcje recyklingu',
      'Kolor': 'Dostępne różne opcje kolorów gminnych'
    }
  },
  
  // Categories in Polish
  'urban infrastructure': {
    id: 'urban infrastructure',
    title: 'Infrastruktura miejska',
    description: 'Produkty do infrastruktury miejskiej',
    image: wasteBox,
    category: 'urban_infrastructure',
    features: [],
    applications: []
  },
  
  // Aluminum products in Polish
  'structural-aluminum': {
    id: 'structural-aluminum',
    title: 'Aluminium konstrukcyjne',
    description: 'Profile aluminiowe o wysokiej wytrzymałości przeznaczone do zastosowań konstrukcyjnych w budownictwie i sektorach przemysłowych.',
    image: standardProfiles, // Using aluminum u-profiles image
    category: 'aluminum',
    features: [
      'Wysoki stosunek wytrzymałości do masy',
      'Doskonała odporność na korozję',
      'Stabilność wymiarowa',
      'Dobre przewodnictwo cieplne',
      'Właściwości niemagnetyczne'
    ],
    applications: [
      'Ramy i konstrukcje przemysłowe',
      'Szkielety budowlane',
      'Modułowe systemy budowlane',
      'Konstrukcje komercyjne',
      'Projekty infrastrukturalne'
    ],
    specifications: {
      'Typ stopu': 'Seria 6000 (6061, 6063, 6082)',
      'Hartowanie': 'T5, T6',
      'Granica plastyczności': '240-260 MPa',
      'Wytrzymałość na rozciąganie': '290-310 MPa',
      'Obróbka powierzchni': 'Wykończenie fabryczne, anodowanie, malowanie proszkowe'
    }
  },
  'architectural-aluminum': {
    id: 'architectural-aluminum',
    title: 'Aluminium architektoniczne',
    description: 'Wysokiej jakości profile aluminiowe do fasad, okien i dekoracyjnych elementów architektonicznych.',
    image: tProfiles, // Using aluminum t-profiles image
    category: 'aluminum',
    features: [
      'Estetycznie atrakcyjny wygląd',
      'Szeroki wybór wykończeń i kolorów',
      'Odporność na warunki atmosferyczne',
      'Trwałość i niskie wymagania konserwacyjne',
      'Doskonałe możliwości formowania'
    ],
    applications: [
      'Systemy fasadowe',
      'Ramy okienne i drzwiowe',
      'Dekoracyjne elementy budynków',
      'Ekrany przeciwsłoneczne i żaluzje',
      'Wewnętrzne przegrody'
    ],
    specifications: {
      'Typ stopu': 'Seria 6000 (głównie 6063)',
      'Hartowanie': 'T5, T6',
      'Opcje wykończenia': 'Anodowanie, malowanie proszkowe, imitacja drewna',
      'Opcje kolorystyczne': 'Według katalogu RAL',
      'Grubość ścianki': '1.2-3.0 mm'
    }
  },
  'industrial-aluminum': {
    id: 'industrial-aluminum',
    title: 'Aluminium przemysłowe',
    description: 'Specjalistyczne profile aluminiowe do produkcji, komponentów maszyn i zastosowań przemysłowych.',
    image: ledProfiles, // Using aluminum industrial profiles image
    category: 'aluminum',
    features: [
      'Wysoka precyzja wymiarowa',
      'Doskonała obrabialność',
      'Elastyczność konstrukcyjna',
      'Odporność na ekstremalne warunki',
      'Dobre przewodnictwo elektryczne'
    ],
    applications: [
      'Zautomatyzowane urządzenia',
      'Systemy przenośnikowe',
      'Ramy przemysłowe',
      'Obudowy elektryczne',
      'Radiatory i wymienniki ciepła'
    ],
    specifications: {
      'Typ stopu': 'Serie 6000 i 7000',
      'Tolerancje': 'Zgodność z normami DIN/ISO',
      'Obróbka powierzchni': 'Anodowanie, pasywacja',
      'Metody łączenia': 'Rowki T, mocowania i złącza',
      'Modułowość': 'Kompatybilność ze standardami przemysłowymi'
    }
  },
  'custom-aluminum': {
    id: 'custom-aluminum',
    title: 'Rozwiązania niestandardowe',
    description: 'Niestandardowe rozwiązania profilowe z aluminium zaprojektowane w celu spełnienia konkretnych wymagań projektu.',
    image: specialProfiles, // Using special aluminum profile image showing custom extrusions
    category: 'aluminum',
    features: [
      'Projektowanie według specyfikacji klienta',
      'Optymalizacja kształtu dla konkretnego zastosowania',
      'Specjalne stopy dla szczególnych wymagań',
      'Niestandardowe właściwości mechaniczne',
      'Niestandardowe wymiary i kształty'
    ],
    applications: [
      'Specjalistyczny sprzęt transportowy',
      'Unikalne elementy budowlane',
      'Komponenty lotnicze i kosmiczne',
      'Zastosowania morskie',
      'Specjalistyczne maszyny przemysłowe'
    ],
    specifications: {
      'Typ stopu': 'Dobrany zgodnie z wymaganiami',
      'Proces produkcyjny': 'Wytłaczanie CNC, frezowanie, obróbka precyzyjna',
      'Dokumentacja': 'Pełna dokumentacja techniczna i certyfikaty',
      'Prototypowanie': 'Dostępne szybkie prototypowanie',
      'Minimalne zamówienie': 'Elastyczne warunki dla projektów specjalnych'
    }
  },
  
  // Infrastructure products translations - Polish
  'rainwater-grill-d400': {
    id: 'rainwater-grill-d400',
    title: 'Kratka ściekowa D400',
    description: 'Wytrzymała kratka ściekowa D400 zaprojektowana do odprowadzania wody w miejscach o dużym natężeniu ruchu.',
    image: 'Rainwater grill D400 1 .png',
    category: 'cast_iron',
    features: [
      'Wysoka wytrzymałość na obciążenia do D400 (40 ton)',
      'Konstrukcja dostosowana do ruchu drogowego',
      'Powierzchnia antypoślizgowa',
      'Łatwa instalacja i konserwacja'
    ],
    applications: [
      'Ulice i drogi',
      'Parkingi',
      'Obiekty komercyjne i przemysłowe',
      'Środowisko miejskie'
    ],
    specifications: {
      'Materiał': 'Żeliwna rama i kratka',
      'Klasyfikacja obciążenia': 'D400 zgodnie z EN 124',
      'Wymiary': '600 x 600 mm (rozmiar standardowy)',
      'Wykończenie': 'Czarne bitumiczne lub powłoka proszkowa'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: 'Włazy kanalizacyjne i ramy',
    description: 'Wytrzymałe żeliwne włazy kanalizacyjne i ramy do infrastruktury miejskiej o różnych klasach obciążenia.',
    image: 'Circular manhole cover (С250)K H80 .png',
    category: 'cast_iron',
    features: [
      'Dostępne różne klasy obciążenia: B125, C250, D400',
      'Konstrukcja z zawiasami lub bez',
      'Mechanizm blokujący dla bezpieczeństwa',
      'Konstrukcja tłumiąca hałas'
    ],
    applications: [
      'Ulice i drogi',
      'Chodniki',
      'Strefy dla pieszych',
      'Systemy kanalizacyjne'
    ],
    specifications: {
      'Materiał': 'Wysokiej jakości szare żeliwo',
      'Klasyfikacja obciążenia': 'Od B125 do D400',
      'Średnica': '600mm, 800mm, 1000mm (rozmiary standardowe)',
      'Wysokość': '80mm do 150mm, w zależności od klasy'
    }
  },
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: 'Rury HDPE (PE100)',
    description: 'Rury z polietylenu wysokiej gęstości o doskonałej odporności chemicznej do systemów wodociągowych, gazowych i kanalizacyjnych.',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      'Doskonała odporność chemiczna',
      'Długa żywotność (ponad 50 lat)',
      'Elastyczne i lekkie',
      'Odporne na korozję',
      'Niskie koszty konserwacji'
    ],
    applications: [
      'Transport wody pitnej',
      'Systemy kanalizacyjne',
      'Rurociągi gazowe',
      'Transport płynów przemysłowych',
      'Systemy drenażowe'
    ],
    specifications: {
      'Materiał': 'PE100 polietylen wysokiej gęstości',
      'Normy': 'EN 12201, ISO 4427',
      'Średnice': '20mm do 2000mm',
      'Klasa ciśnienia': 'PN6.3 do PN25',
      'Połączenia': 'Zgrzewanie elektrooporowe, doczołowe, złączki mechaniczne'
    }
  },
  'gate-valve-pl': {
    id: 'gate-valve',
    title: 'Zasuwa',
    description: 'Żeliwne zasuwy do systemów wodociągowych i zastosowań przemysłowych o doskonałym uszczelnieniu i długiej żywotności.',
    image: gateValve,
    category: 'valves',
    features: [
      'Pełny przepływ w pozycji otwartej',
      'Niski spadek ciśnienia',
      'Długotrwała zdolność uszczelniania',
      'Dwukierunkowa kontrola przepływu'
    ],
    applications: [
      'Systemy wodociągowe',
      'Systemy ściekowe',
      'Systemy przemysłowe',
      'Systemy nawadniania'
    ],
    specifications: {
      'Materiał': 'Korpus z szarego żeliwa, trzpień ze stali nierdzewnej',
      'Rozmiar': 'DN50-DN500',
      'Klasa ciśnienia': 'PN10-PN16',
      'Połączenie': 'Kołnierzowe zgodnie z EN 1092-2'
    }
  },
  'ground-fire-hydrant': {
    id: 'ground-fire-hydrant',
    title: 'Hydrant nadziemny',
    description: 'Dobrze widoczny hydrant nadziemny zapewniający szybki dostęp do wody w sytuacjach awaryjnych.',
    image: 'Ground fire hydrant .png',
    category: 'fire-protection',
    features: [
      'Automatyczny zawór odwadniający zapobiegający zamarzaniu',
      'Łatwo zauważalny czerwony kolor',
      'Odporny na korozję',
      'System szybkiej aktywacji'
    ],
    applications: [
      'Miejska infrastruktura przeciwpożarowa',
      'Obiekty przemysłowe',
      'Centra handlowe',
      'Kompleksy mieszkalne',
      'Lotniska i terminale transportowe'
    ],
    specifications: {
      'Materiał': 'Korpus z żeliwa z powłoką ochronną',
      'Połączenie': 'Połączenie kołnierzowe DN80-100',
      'Ciśnienie robocze': 'PN16',
      'Wyloty': '2-3 wyloty (Storz)',
      'Wysokość': '750-1500mm',
      'Aktywacja': 'Klucz do hydrantu'
    }
  }
};

// For simplicity, let's directly use the appropriate images for Chinese translations
// No need for aliases that could cause reference errors

// Chinese (zh-CN) product details map
const zhCNProductDetailsMap: Record<string, ProductDetails> = {
  'standard-profiles': {
    id: 'standard-profiles',
    title: '标准型材',
    description: '高质量铝型材，用于各种建筑和工业应用，符合国际标准和规格。',
    image: standardProfiles,
    category: 'aluminum',
    features: [
      '经过精心设计的型材，适合各种建筑和工业用途',
      '表面光洁度高，外观美观',
      '易于组装和安装',
      '耐腐蚀和耐候性强',
      '可用于内部和外部应用'
    ],
    applications: [
      '建筑外立面和幕墙',
      '商业和住宅建筑项目',
      '太阳能支架系统',
      '家具和室内装饰',
      '展示架和展览系统'
    ],
    specifications: {
      '材料': '优质铝合金 (6063-T5)',
      '表面处理': '阳极氧化, 粉末涂层, 或木纹饰面',
      '长度': '标准长度 6m, 定制尺寸可用',
      '硬度': 'HB 75-85',
      '抗拉强度': '≥215 MPa'
    }
  },
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: '机械制造型材',
    description: '用于机械工程和工业自动化的专用铝型材，提供高精度和灵活的组装选项。',
    image: machineProfiles,
    category: 'aluminum',
    features: [
      '精确的尺寸公差，确保组装的准确性',
      '模块化设计，允许灵活配置',
      '与标准连接系统兼容',
      '高强度铝合金，提供卓越的稳定性',
      '多种尺寸和配置可选'
    ],
    applications: [
      '工业自动化系统',
      '生产线框架和围栏',
      '机器防护装置',
      '工作站和装配台',
      '实验室设备和测试台'
    ],
    specifications: {
      '材料': '高强度铝合金 (6082-T6)',
      '表面处理': '自然阳极氧化或黑色阳极氧化',
      '尺寸精度': '±0.2mm',
      '槽宽': '8mm 或 10mm',
      '抗拉强度': '≥295 MPa'
    }
  },
  'led-profiles': {
    id: 'led-profiles',
    title: 'LED照明型材',
    description: '专为LED照明系统设计的铝型材，提供高效散热和灵活安装选项。',
    image: ledProfiles,
    category: 'aluminum',
    features: [
      '优化的散热设计，延长LED寿命',
      '提供多种安装选项（表面、嵌入、悬挂）',
      '集成漫射器和透镜选项',
      '易于安装和维护',
      '适合直线和定制照明解决方案'
    ],
    applications: [
      '商业照明',
      '住宅室内照明',
      '展览和展示照明',
      '橱柜和架子照明',
      '建筑装饰照明'
    ],
    specifications: {
      '材料': '高导热铝合金',
      '表面处理': '阳极氧化（银色、黑色或白色）',
      '兼容性': '适用于各种LED条带和模块',
      '散热能力': '高效散热设计',
      '配件': '端盖、夹子、悬挂套件和漫射器'
    }
  },
  'special-profiles': {
    id: 'special-profiles',
    title: '特殊定制型材',
    description: '根据客户规格定制的铝型材解决方案，适用于特殊应用和独特项目需求。',
    image: specialProfiles,
    category: 'aluminum',
    features: [
      '完全定制设计以满足特定要求',
      '专业工程支持和解决方案开发',
      '可用于复杂和技术要求高的应用',
      '优化材料使用和性能',
      '用于独特项目和应用的创新解决方案'
    ],
    applications: [
      '航空航天和国防',
      '特种运输和汽车',
      '定制建筑元素',
      '医疗设备和洁净室',
      '特殊工业项目'
    ],
    specifications: {
      '材料': '多种铝合金可选，包括7000系列',
      '表面处理': '多种处理选项，适合特殊环境',
      '公差': '高精度，符合严格标准',
      '设计服务': '提供完整CAD设计和工程支持',
      '生产': '原型和批量生产'
    }
  },
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: '高密度聚乙烯管道',
    description: '高质量HDPE管道系统，用于供水、燃气和工业应用，提供卓越的耐用性和灵活性。',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      '高耐腐蚀性，不受化学物质和土壤条件影响',
      '高柔韧性，减少接头和渗漏风险',
      '低摩擦系数，提供卓越的流体动力性能',
      '长使用寿命，超过50年的预期寿命',
      '轻便，易于处理和安装'
    ],
    applications: [
      '饮用水供应网络',
      '污水和排水系统',
      '工业流体输送',
      '天然气分配',
      '农业灌溉'
    ],
    specifications: {
      '材料': 'PE100 / PE100 RC 高密度聚乙烯',
      '直径范围': 'DN 20 - DN 1200 mm',
      '压力等级': 'PN 6 - PN 25',
      '标准': 'EN 12201, ISO 4427',
      '连接方式': '电熔、对接焊接或机械接头'
    }
  },
  'double-corrugated-pipes': {
    id: 'double-corrugated-pipes',
    title: '双壁波纹管',
    description: '双壁结构聚乙烯波纹管，用于高效雨水管理和排水系统，具有卓越的强度和灵活性。',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      '双壁设计，提供高环刚度和低重量',
      '出色的抗压性，适用于重载交通区域',
      '灵活的管道设计，适应地基移动',
      '光滑的内壁，提供最佳水力性能',
      '快速安装系统，带集成的密封接头'
    ],
    applications: [
      '市政雨水收集系统',
      '公路和铁路排水',
      '农田排水系统',
      '工业排水应用',
      '景观和运动场地排水'
    ],
    specifications: {
      '材料': '高密度聚乙烯 (HDPE)',
      '直径范围': 'DN 100 - DN 1000 mm',
      '环刚度': 'SN4 - SN16 kN/m²',
      '颜色': '黑色外部，绿色/蓝色内部',
      '标准': 'EN 13476, ISO 21138'
    }
  },
  'reinforced-corrugated-pipes': {
    id: 'reinforced-corrugated-pipes',
    title: '钢筋波纹管',
    description: '钢筋增强的聚乙烯波纹管，为要求苛刻的排水和排污项目提供卓越的强度和耐用性。',
    image: steelReinforcedPipe, // Correct image reference from imports
    category: 'polyethylene',
    features: [
      '钢筋增强结构，提供极高的抗压强度',
      '高环刚度，适用于极端载荷条件',
      '耐化学腐蚀和磨损',
      '长使用寿命，在极端条件下仍保持完整性',
      '与标准管道系统兼容'
    ],
    applications: [
      '深埋排水系统',
      '重载交通区域的基础设施',
      '工业废水处理',
      '海岸和海洋排水应用',
      '矿业和采石场'
    ],
    specifications: {
      '材料': '钢筋增强高密度聚乙烯',
      '直径范围': 'DN 300 - DN 1200 mm',
      '环刚度': '高达 SN16+ kN/m²',
      '加固类型': '螺旋钢筋或钢网',
      '标准': 'EN 13476, ASTM F2435'
    }
  },
  'hsaw-pipes': {
    id: 'hsaw-pipes',
    title: '螺旋埋弧焊钢管',
    description: '高强度螺旋埋弧焊接钢管，用于大型基础设施和管道项目，提供卓越的结构完整性。',
    image: steelPipesOilGas, // Using available image for steel pipes
    category: 'steel',
    features: [
      '高强度螺旋焊接，确保结构完整性',
      '大直径能力，用于主要输送管线',
      '优异的抗震和抗变形性能',
      '长管段，减少现场接头',
      '提供各种内外涂层选项，增强保护'
    ],
    applications: [
      '水输送和配水系统',
      '石油和天然气运输',
      '海底管道',
      '桩基础系统',
      '压力管路和隧道衬砌'
    ],
    specifications: {
      '材料': '碳钢（API 5L Gr.B 至 X70）',
      '直径范围': 'DN 400 - DN 3000 mm',
      '壁厚': '6 mm - 25 mm',
      '长度': '标准管段长度 12m',
      '涂层': 'FBE, 3LPE, 水泥砂浆衬里等'
    }
  },
  'oil-gas-pipes': {
    id: 'oil-gas-pipes',
    title: '油气输送钢管',
    description: '专为油气工业设计的高压高强度钢管，提供安全可靠的石油和天然气运输解决方案。',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      '高强度钢材，满足严格的工业标准',
      '抗高压、高温和腐蚀环境',
      '经过严格质量控制和材料测试',
      '精密焊接和接头设计，确保密封性',
      '专业内外防腐处理'
    ],
    applications: [
      '原油和精炼石油产品输送',
      '天然气管道网络',
      '石化厂内工艺管道',
      '海上钻井平台连接',
      '储存设施连接'
    ],
    specifications: {
      '材料': '合金钢（API 5L X42 至 X70）',
      '直径范围': 'DN 100 - DN 1400 mm',
      '压力等级': '高达 Class 900 (PN150)',
      '标准': 'API 5L, ISO 3183',
      '接头类型': '对接焊、法兰或专用连接'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: '井盖',
    description: '高强度铸铁井盖，用于地下设施和公用事业接入点，提供耐用安全的解决方案。',
    image: manholeD400,
    category: 'cast-iron',
    features: [
      '球墨铸铁材料，提供出色的承重能力',
      '符合国际负荷等级标准',
      '防盗设计选项，增强安全性',
      '各种尺寸和类型，满足不同应用需求',
      '耐用设计，可承受恶劣环境和重型车辆'
    ],
    applications: [
      '道路和人行道',
      '市政排水系统',
      '电信和电力网络接入',
      '供水系统接入点',
      '工业区域和港口'
    ],
    specifications: {
      '材料': '球墨铸铁 GGG50/GJS-500-7',
      '负荷等级': 'A15 至 F900 (EN124)',
      '直径/尺寸': '多种标准规格可选',
      '开启方式': '铰链式或可完全移除',
      '表面处理': '防滑纹理，可选标志或定制设计'
    }
  },
  'drainage-grates': {
    id: 'drainage-grates',
    title: '排水格栅',
    description: '高品质铸铁排水格栅，用于高效雨水收集和城市排水系统，具有良好的水流能力和抗负荷特性。',
    image: drainageGrateC250,
    category: 'cast-iron',
    features: [
      '优化的格栅设计，最大化水流收集',
      '高强度铸铁材料，确保长期耐用性',
      '各种负荷等级，适应不同交通条件',
      '安装简便，与标准排水渠兼容',
      '防堵设计，减少维护需求'
    ],
    applications: [
      '城市道路排水',
      '停车场和商业区域',
      '公园和公共区域',
      '工业厂区',
      '住宅开发区'
    ],
    specifications: {
      '材料': '球墨铸铁 GGG50/GJS-500-7',
      '负荷等级': 'A15 至 F900 (EN124)',
      '尺寸': '多种标准宽度和长度',
      '水流容量': '优化设计，提高收集效率',
      '安装方式': '兼容各种排水渠和地沟系统'
    }
  }
};

// Function to get product details based on ID and language
export const getProductDetails = (id: string, locale: string): ProductDetails | undefined => {
  if (!id) {
    console.warn('getProductDetails called with empty id');
    return undefined;
  }
  
  // Normalize product ID to ensure consistent lookup
  const productId = id.toLowerCase().replace(/\s+/g, '-');
  
  console.log(`Found translation for ${productId} in ${locale}`);
  
  // Get the details map for the requested locale
  const detailsMap = (() => {
    switch(locale) {
      case 'ru': return ruProductDetailsMap;
      case 'et': return etProductDetailsMap;
      case 'lv': return lvProductDetailsMap;
      case 'lt': return ltProductDetailsMap;
      case 'pl': return plProductDetailsMap;
      case 'zh-CN': 
        // Ensure Chinese product map is properly initialized
        if (!importedChineseProductMap || Object.keys(importedChineseProductMap).length === 0) {
          console.warn('Chinese product map not properly loaded, using English fallback');
          return enProductDetailsMap;
        }
        return importedChineseProductMap; // Chinese language support
      default: return enProductDetailsMap; // Default to English
    }
  })();
  
  // Try to get product details from selected language map
  const result = detailsMap[productId];
  
  // Always get English version for fallback purposes
  const englishFallback = enProductDetailsMap[productId];
  
  // If we found a result in the requested language, process it with fallbacks
  if (result) {
    // For all locales, ensure we have proper fallbacks for missing fields
    // This ensures product data displays properly in all languages
    // Create a complete product by ensuring all required fields are present
    const completeProduct: ProductDetails = {
      // ID is always required and must be consistent
      id: productId,
      // Use translations if available, otherwise fall back to English
      title: result.title || (englishFallback?.title || "Product " + productId),
      description: result.description || (englishFallback?.description || ""),
      // Image should be consistent across languages but can fall back if needed
      image: result.image || (englishFallback?.image || ""),
      category: result.category || (englishFallback?.category || "other"),
      link: result.link || (englishFallback?.link || `/product?id=${productId}`),
      // Ensure arrays are properly handled for all languages
      features: Array.isArray(result.features) && result.features.length > 0 
        ? result.features 
        : (englishFallback?.features || []),
      applications: Array.isArray(result.applications) && result.applications.length > 0 
        ? result.applications 
        : (englishFallback?.applications || []),
      // Maintain other optional fields
      specifications: result.specifications || (englishFallback?.specifications || {}),
      status: result.status || (englishFallback?.status || ""),
      documents: Array.isArray(result.documents) ? result.documents : 
                (Array.isArray(englishFallback?.documents) ? englishFallback.documents : [])
    };
    
    if (locale === 'zh-CN') {
      console.log(`Enhanced Chinese translation for product: ${productId}`);
    }
    
    return completeProduct;
  }
  
  // Otherwise, fall back to English if available
  if (englishFallback) {
    console.log(`Using English fallback for: ${productId} in ${locale}`);
    
    // Ensure the English fallback has all required fields
    const enhancedFallback: ProductDetails = {
      id: productId,
      title: englishFallback.title || "Product " + productId,
      description: englishFallback.description || "",
      image: englishFallback.image || "",
      category: englishFallback.category || "other",
      link: englishFallback.link || `/product?id=${productId}`,
      features: Array.isArray(englishFallback.features) ? englishFallback.features : [],
      applications: Array.isArray(englishFallback.applications) ? englishFallback.applications : [],
      specifications: englishFallback.specifications || {},
      status: englishFallback.status || "",
      documents: Array.isArray(englishFallback.documents) ? englishFallback.documents : []
    };
    
    return enhancedFallback;
  }
  
  // Create default product as last-resort fallback
  const defaultProduct: ProductDetails = {
    id: productId,
    title: productId.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
    description: "Product information",
    image: "",
    category: "other",
    link: `/product?id=${productId}`,
    features: [],
    applications: [],
    specifications: {},
    status: "available",
    documents: []
  };

  // No match found in static data, try API fetch with error handling
  try {
    // Make a synchronous fetch to the API
    const response = new XMLHttpRequest();
    response.open('GET', `/api/products/${productId}?language=${locale}`, false); // false makes it synchronous
    response.send();
    
    if (response.status === 200) {
      const apiProduct = JSON.parse(response.responseText);
      console.log(`Found product ${productId} from API in ${locale} language`);
      
      // Convert API product to ProductDetails format
      const convertedProduct: ProductDetails = {
        id: productId,
        title: apiProduct.title || 'Unknown Product',
        description: apiProduct.description || '',
        image: apiProduct.image || '',
        category: apiProduct.category || 'uncategorized',
        features: apiProduct.features || [],
        applications: apiProduct.applications || [],
        specifications: apiProduct.specifications || {},
        status: apiProduct.status || 'unknown'
      };
      
      // Fetch associated documents
      try {
        const documentsResponse = new XMLHttpRequest();
        documentsResponse.open('GET', `/api/products/${productId}/documents`, false);
        documentsResponse.send();
        
        if (documentsResponse.status === 200) {
          const documents = JSON.parse(documentsResponse.responseText);
          if (documents && documents.length > 0) {
            convertedProduct.documents = documents.filter((doc: Document) => 
              !doc.language || doc.language === locale || doc.language === 'en'
            );
          }
        }
      } catch (docError) {
        console.error('Error fetching documents for product:', docError);
      }
      
      return convertedProduct;
    }
  } catch (error) {
    console.error('Error fetching product from API:', error);
  }
  
  // If all methods failed, return default product instead of undefined
  // This ensures the products page never breaks completely
  console.log(`No product details found for id: ${productId} in language: ${locale}, using default`);
  return defaultProduct;
};

// Helper function to sanitize specifications to ensure all values are strings
export const sanitizeSpecifications = (specs: Record<string, any> | undefined): Record<string, string> => {
  if (!specs) return {};
  
  try {
    const sanitizedSpecs: Record<string, string> = {};
    
    Object.entries(specs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        sanitizedSpecs[key] = String(value);
      } else {
        // Provide empty string for undefined/null values
        sanitizedSpecs[key] = '';
      }
    });
    
    return sanitizedSpecs;
  } catch (error) {
    console.error("Error sanitizing specifications:", error);
    // Return empty object on error to prevent UI crashes
    return {};
  }
};

// Export for use in other parts of the application
export const productDetailsMap = enProductDetailsMap;
export default productDetailsMap;