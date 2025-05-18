import { storage } from './storage';
import fs from 'fs';
import path from 'path';

// Define the products to import
const productsToImport = [
  // Aluminum Profiles
  {
    productId: 'standard-profiles',
    title: 'Standard Aluminum Profiles',
    description: 'High-quality standard aluminum profiles for various applications in construction and industry. Our profiles are manufactured according to European standards.',
    image: '/uploads/standard-aluminum-profiles.jpg',
    category: 'aluminum',
    status: 'in stock',
    language: 'en',
    features: [
      'Lightweight and durable',
      'Corrosion resistant',
      'Excellent thermal conductivity',
      'Easy to machine and form',
      'Recyclable material'
    ],
    applications: [
      'Construction industry',
      'Furniture manufacturing',
      'Window and door systems',
      'Interior design',
      'Exhibition stands and displays'
    ],
    specifications: {
      'Material': 'Aluminum alloy 6063-T5/T6',
      'Surface Finish': 'Mill finish, anodized, powder coated',
      'Standard Length': '6000mm ± 20mm',
      'Wall Thickness': '1.5mm - 3.0mm',
      'Tensile Strength': '≥ 215 MPa'
    }
  },
  {
    productId: 'machine-building-profiles',
    title: 'Machine Building Profiles',
    description: 'Specialized aluminum profiles designed for machine building applications. These profiles offer exceptional precision and stability for industrial equipment.',
    image: '/uploads/machine-building-profiles.jpg',
    category: 'aluminum',
    status: 'in stock',
    language: 'en',
    features: [
      'High precision dimensions',
      'Excellent mechanical properties',
      'Multiple mounting options',
      'Compatible with standard connectors',
      'Vibration dampening'
    ],
    applications: [
      'Industrial automation',
      'Conveyor systems',
      'Machine guards and enclosures',
      'Workstations and assembly lines',
      'Robotics frames'
    ],
    specifications: {
      'Material': 'Aluminum alloy 6082-T6/T651',
      'Surface Finish': 'Anodized (typically 10-15μm)',
      'Standard Length': '6000mm ± 10mm',
      'Tolerance': 'According to EN 755-9',
      'Straightness': '≤ 1.5mm/m'
    }
  },
  {
    productId: 'led-profiles',
    title: 'LED Aluminum Profiles',
    description: 'Specialized aluminum profiles for LED lighting applications. These profiles provide effective heat dissipation and elegant design for modern lighting solutions.',
    image: '/uploads/led-aluminum-profiles.jpg',
    category: 'aluminum',
    status: 'in stock',
    language: 'en',
    features: [
      'Optimized heat dissipation',
      'Integrated diffuser options',
      'Easy installation',
      'Various mounting options',
      'Aesthetic finish'
    ],
    applications: [
      'Commercial lighting',
      'Residential lighting',
      'Display lighting',
      'Accent lighting',
      'Furniture integration'
    ],
    specifications: {
      'Material': 'Aluminum alloy 6063-T5',
      'Surface Finish': 'Anodized (silver, black, white)',
      'Standard Length': '2000mm/3000mm',
      'Compatible with': 'LED strips up to 12mm width',
      'Heat Dissipation': 'Up to 25W/m'
    }
  },
  {
    productId: 'special-profiles',
    title: 'Special Aluminum Profiles',
    description: 'Custom and special purpose aluminum profiles designed for specific applications. Our engineering team can develop profiles tailored to your exact requirements.',
    image: '/uploads/special-aluminum-profiles.jpg',
    category: 'aluminum',
    status: 'made to order',
    language: 'en',
    features: [
      'Custom design according to specifications',
      'Complex geometries possible',
      'Specialized alloys available',
      'Custom surface treatments',
      'Prototype to production services'
    ],
    applications: [
      'Solar mounting systems',
      'Specialized transportation',
      'Unique architectural elements',
      'OEM components',
      'Custom machinery'
    ],
    specifications: {
      'Material': 'Various aluminum alloys available',
      'Design Service': 'Full engineering support',
      'Production': 'Prototype to mass production',
      'Quality Control': 'According to ISO 9001',
      'Documentation': 'Full technical specifications provided'
    }
  },
  
  // Polyethylene Pipes
  {
    productId: 'hdpe-pipes',
    title: 'HDPE Pipes',
    description: 'High-Density Polyethylene pipes for water supply, sewage, and drainage applications. Our HDPE pipes offer excellent durability and resistance to chemicals.',
    image: '/uploads/hdpe-pipes.jpg',
    category: 'polyethylene',
    status: 'in stock',
    language: 'en',
    features: [
      'High durability and long service life',
      'Chemical and corrosion resistance',
      'Flexible and impact resistant',
      'Low maintenance',
      'Environmentally friendly'
    ],
    applications: [
      'Potable water distribution',
      'Sewage systems',
      'Industrial applications',
      'Irrigation systems',
      'Gas distribution'
    ],
    specifications: {
      'Material': 'PE100/PE80',
      'Pressure Rating': 'PN6.3/PN10/PN16',
      'Diameter Range': '20mm-1200mm',
      'Standard': 'EN 12201, ISO 4427',
      'Connection': 'Butt fusion, electrofusion'
    }
  },
  {
    productId: 'double-corrugated-pipes',
    title: 'Double-Wall Corrugated Pipes',
    description: 'Double-wall corrugated polyethylene pipes designed for drainage and sewage systems. These pipes combine flexibility with high ring stiffness.',
    image: '/uploads/double-corrugated-pipes.jpg',
    category: 'polyethylene',
    status: 'in stock',
    language: 'en',
    features: [
      'High ring stiffness',
      'Lightweight and easy to install',
      'Excellent hydraulic properties',
      'Resistant to abrasion and chemicals',
      'Long service life (50+ years)'
    ],
    applications: [
      'Storm water drainage',
      'Highway drainage systems',
      'Agricultural drainage',
      'Culverts',
      'Non-pressure sewage systems'
    ],
    specifications: {
      'Material': 'High-density polyethylene',
      'Ring Stiffness': 'SN4, SN8, SN16',
      'Diameter Range': '100mm-1000mm',
      'Standard': 'EN 13476',
      'Connection': 'Socket and spigot with rubber seal'
    }
  },
  {
    productId: 'reinforced-corrugated-pipes',
    title: 'Steel-Reinforced Corrugated Pipes',
    description: 'Steel-reinforced corrugated polyethylene pipes for high-load applications. These pipes combine the chemical resistance of PE with the strength of steel reinforcement.',
    image: '/uploads/reinforced-corrugated-pipes.jpg',
    category: 'polyethylene',
    status: 'in stock',
    language: 'en',
    features: [
      'Extremely high ring stiffness',
      'Suitable for high traffic loads',
      'Chemical and corrosion resistant',
      'Excellent hydraulic performance',
      'Fast installation'
    ],
    applications: [
      'Heavy traffic areas',
      'Deep installation depths',
      'Railway crossings',
      'Industrial areas',
      'Airports'
    ],
    specifications: {
      'Material': 'HDPE with steel reinforcement',
      'Ring Stiffness': 'SN8 to SN16',
      'Diameter Range': '300mm-2000mm',
      'Load Class': 'Up to E600',
      'Connection': 'Coupler with rubber seal'
    }
  },
  
  // Steel Pipes
  {
    productId: 'hsaw-pipes',
    title: 'HSAW Steel Pipes',
    description: 'Helical Submerged Arc Welded (HSAW) steel pipes for water transmission, piling, and structural applications. These pipes offer excellent strength and durability.',
    image: '/uploads/hsaw-pipes.jpg',
    category: 'steel',
    status: 'in stock',
    language: 'en',
    features: [
      'High strength-to-weight ratio',
      'Excellent weld quality',
      'Uniform wall thickness',
      'Suitable for high-pressure applications',
      'Various coating options available'
    ],
    applications: [
      'Water transmission lines',
      'Oil and gas pipelines',
      'Piling applications',
      'Structural columns',
      'Casing pipes'
    ],
    specifications: {
      'Material': 'Carbon steel (S235JR to S355J2)',
      'Diameter Range': '400mm-3000mm',
      'Wall Thickness': '6mm-25mm',
      'Standard': 'EN 10219, API 5L',
      'Coating': 'FBE, 3LPE, cement mortar'
    }
  },
  {
    productId: 'oil-gas-pipes',
    title: 'Oil and Gas Steel Pipes',
    description: 'High-quality steel pipes specifically designed for oil and gas transportation. These pipes meet the strict requirements of the petroleum industry.',
    image: '/uploads/oil-gas-pipes.jpg',
    category: 'steel',
    status: 'in stock',
    language: 'en',
    features: [
      'High pressure rating',
      'Excellent corrosion resistance',
      'Sour service capability',
      'Low temperature toughness',
      'Precise dimensional control'
    ],
    applications: [
      'Oil transmission',
      'Natural gas pipelines',
      'Offshore platforms',
      'Refinery piping',
      'Gathering lines'
    ],
    specifications: {
      'Material': 'API 5L X42-X70',
      'Diameter Range': '114mm-1420mm',
      'Wall Thickness': '6mm-40mm',
      'Standard': 'API 5L, ISO 3183',
      'Connection': 'Welded, flanged, threaded'
    }
  },
  
  // Cast Iron Products
  {
    productId: 'manhole-covers',
    title: 'Cast Iron Manhole Covers',
    description: 'Durable cast iron manhole covers designed for various load requirements. Our manhole covers ensure safety, accessibility, and longevity in urban infrastructure.',
    image: '/uploads/manhole-covers.jpg',
    category: 'cast-iron',
    status: 'in stock',
    language: 'en',
    features: [
      'High load bearing capacity',
      'Durable and long-lasting',
      'Anti-theft design options',
      'Various patterns available',
      'Noise reduction designs'
    ],
    applications: [
      'Road infrastructure',
      'Pedestrian areas',
      'Parking lots',
      'Industrial areas',
      'Telecommunication networks'
    ],
    specifications: {
      'Material': 'Ductile cast iron EN-GJS-500-7',
      'Load Classes': 'A15, B125, C250, D400, E600, F900',
      'Standard': 'EN 124',
      'Coating': 'Black bituminous paint',
      'Options': 'Lockable, ventilated, custom markings'
    }
  },
  {
    productId: 'drainage-grates',
    title: 'Cast Iron Drainage Grates',
    description: 'High-quality cast iron drainage grates for effective water management in urban environments. Our grates provide optimal flow capacity while maintaining strength.',
    image: '/uploads/drainage-grates.jpg',
    category: 'cast-iron',
    status: 'in stock',
    language: 'en',
    features: [
      'Optimized hydraulic flow',
      'Anti-slip surface',
      'High strength',
      'Various designs available',
      'Compatible with standard frames'
    ],
    applications: [
      'Street drainage',
      'Highway drainage',
      'Parking areas',
      'Industrial facilities',
      'Residential developments'
    ],
    specifications: {
      'Material': 'Ductile cast iron EN-GJS-500-7',
      'Load Classes': 'C250, D400, E600',
      'Standard': 'EN 124',
      'Coating': 'Black bituminous paint',
      'Inlet Area': 'Optimized for maximum flow'
    }
  }
];

// Function to copy images from attached_assets to public/uploads
async function copyProductImages() {
  const sourceDir = path.join(process.cwd(), 'attached_assets');
  const targetDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Create upload directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Map of source files to target files
  const imageMap = {
    'Aluminum-Profile-Extrusion.jpg': 'special-aluminum-profiles.jpg',
    'Aluminum-Profile-Extrusion.webp': 'standard-aluminum-profiles.jpg',
    'Aluminum LED Profile.jpg': 'led-aluminum-profiles.jpg',
    'Aluminum T-Profiles.jpg': 'machine-building-profiles.jpg',
    'HDPE pipes (PE pipes) .png': 'hdpe-pipes.jpg',
    'Double corrugated pipes .png': 'double-corrugated-pipes.jpg',
    'Steel reinforced corrugated polyethilene pipe.png': 'reinforced-corrugated-pipes.jpg',
    'Helical Submerged Arc Welded (HSAW) Pipes For Water Purpose.png': 'hsaw-pipes.jpg',
    'Steel Pipes For Oil and Gas Purpose .png': 'oil-gas-pipes.jpg',
    'Circular manhole cover (С250)K H80 .png': 'manhole-covers.jpg',
    'Rainwater grille C250 .png': 'drainage-grates.jpg'
  };

  // Copy files
  for (const [source, target] of Object.entries(imageMap)) {
    try {
      const sourcePath = path.join(sourceDir, source);
      const targetPath = path.join(targetDir, target);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied ${source} to ${targetPath}`);
      } else {
        console.warn(`Source file ${source} does not exist`);
      }
    } catch (error) {
      console.error(`Error copying ${source}: ${error}`);
    }
  }
}

// Function to import products
async function importProducts() {
  try {
    // First copy the images
    await copyProductImages();
    
    console.log(`Starting to import ${productsToImport.length} products...`);
    
    // Import each product
    for (const product of productsToImport) {
      try {
        const existingProduct = await storage.getProduct(product.productId);
        
        if (!existingProduct) {
          const createdProduct = await storage.createProduct(product);
          console.log(`Imported product: ${product.title}`);
        } else {
          console.log(`Product ${product.title} already exists, skipping`);
        }
      } catch (error) {
        console.error(`Error importing product ${product.title}:`, error);
      }
    }
    
    console.log('Product import completed');
  } catch (error) {
    console.error('Import error:', error);
  }
}

// Run the import
importProducts();