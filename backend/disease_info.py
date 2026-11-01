"""
Plant Disease Detection - 38 PlantVillage Classes Knowledge Base
Provides comprehensive agricultural metadata, symptoms, and organic/chemical remedies.
"""

DISEASE_METADATA = {
    "Apple___Apple_scab": {
        "crop": "Apple",
        "disease": "Apple Scab",
        "pathogen": "Venturia inaequalis (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Olive-green to dull brown velvety spots on upper leaf surfaces that later become scabby and distorted.",
        "organic_remedy": "Apply sulfur or liquid copper sprays at bud break; rake and destroy fallen leaves to reduce overwintering spores.",
        "chemical_remedy": "Captan 50WP, Myclobutanil, or Difenoconazole applied at early pink bud stage.",
        "prevention": "Prune tree canopies to improve air circulation; choose scab-resistant apple cultivars like Honeycrisp or Liberty."
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "disease": "Black Rot (Frogeye Leaf Spot)",
        "pathogen": "Botryosphaeria obtusa (Fungus)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Small purple flecks on leaves expanding into circular 'frogeye' spots with tan centers and purple margins.",
        "organic_remedy": "Prune out dead shoots, mummified fruits, and cankers 6-8 inches below infected zone.",
        "chemical_remedy": "Thiophanate-methyl, Captan, or Fludioxonil protectant sprays.",
        "prevention": "Remove dead wood from orchard borders; maintain tree vigor with balanced nitrogen fertilization."
    },
    "Apple___Cedar_apple_rust": {
        "crop": "Apple",
        "disease": "Cedar Apple Rust",
        "pathogen": "Gymnosporangium juniperi-virginianae (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Bright yellow-orange or reddish spots on upper leaf surfaces; tube-like fungal aecia emerge on underside.",
        "organic_remedy": "Apply sulfur or neem oil early in season; remove nearby eastern red cedar trees within 1 mile if feasible.",
        "chemical_remedy": "Myclobutanil (Immunox) or Mancozeb sprays beginning at pink bud stage through petal fall.",
        "prevention": "Plant rust-resistant apple varieties (e.g., Redfree, Prima); avoid planting near ornamental junipers."
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Vibrant, uniform green foliage with smooth margins and no visible lesions, chlorosis, or necrotic spots.",
        "organic_remedy": "Continue routine organic foliar feeding with kelp or compost tea.",
        "chemical_remedy": "No chemical intervention needed.",
        "prevention": "Maintain consistent drip irrigation, seasonal pruning, and IPM scouting."
    },
    "Blueberry___healthy": {
        "crop": "Blueberry",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Firm, elliptical dark green leaves with distinct veining and no marginal scorching.",
        "organic_remedy": "Maintain acidic soil pH (4.5 - 5.5) using pine bark mulch and elemental sulfur.",
        "chemical_remedy": "None required.",
        "prevention": "Keep roots evenly moist and protect bushes with bird netting."
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "crop": "Cherry",
        "disease": "Powdery Mildew",
        "pathogen": "Podosphaera clandestina (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "White powdery fungal mycelium on younger leaves, leading to leaf curling, puckering, and early leaf drop.",
        "organic_remedy": "Apply potassium bicarbonate, horticultural mineral oils, or bio-fungicide Bacillus subtilis (Serenade).",
        "chemical_remedy": "Myclobutanil, Quinoxyfen, or Tebuconazole sprays starting at petal fall.",
        "prevention": "Avoid excess spring nitrogen that fuels succulent shoots; prune to maximize sunlight penetration."
    },
    "Cherry_(including_sour)___healthy": {
        "crop": "Cherry",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Deep emerald, glossy serrated leaves with strong petiole attachment and no curling.",
        "organic_remedy": "Ensure proper organic mulching around the root drip zone.",
        "chemical_remedy": "None required.",
        "prevention": "Monitor for cherry fruit flies and aphids during growing season."
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "crop": "Corn (Maize)",
        "disease": "Gray Leaf Spot",
        "pathogen": "Cercospora zeae-maydis (Fungus)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Narrow, rectangular tan to gray lesions bounded by leaf veins; lesions coalesce and kill entire leaves.",
        "organic_remedy": "Crop rotation with non-host crops (soybeans, legumes); residue burial via tillage to bury fungal debris.",
        "chemical_remedy": "Azoxystrobin + Propiconazole (Quilt Xcel) or Pyraclostrobin applied at VT (tasseling) stage.",
        "prevention": "Select corn hybrids with high GLS tolerance; avoid planting in continuous no-till corn systems."
    },
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn (Maize)",
        "disease": "Common Rust",
        "pathogen": "Puccinia sorghi (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Golden-brown to cinnamon-brown powdery pustules scattered across both upper and lower leaf surfaces.",
        "organic_remedy": "Usually managed through natural predators; plant early to avoid late summer spore flushes.",
        "chemical_remedy": "Foliar strobilurin or triazole fungicides (Headline AMP, Trivapro) when pustules appear on ear leaves.",
        "prevention": "Plant resistant hybrids bearing Rp genes; balance soil potassium levels."
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn (Maize)",
        "disease": "Northern Corn Leaf Blight (NCLB)",
        "pathogen": "Exserohilum turcicum (Fungus)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Large, cigar-shaped grayish-green to tan lesions (1-6 inches long) starting on lower leaves.",
        "organic_remedy": "Deep tillage to bury crop debris; rotation away from corn for at least 2 seasons.",
        "chemical_remedy": "Apply strobilurin/triazole fungicide mixtures if lesions appear prior to pollination.",
        "prevention": "Plant hybrids possessing Ht-resistance genes; avoid overhead irrigation during humid weather."
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn (Maize)",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Robust, upright, deep-green linear leaves with clear midribs and zero chlorotic bands.",
        "organic_remedy": "Apply organic fish emulsion or side-dress with composted manure during V6 growth stage.",
        "chemical_remedy": "None required.",
        "prevention": "Maintain weed-free rows and scout weekly for armyworms and corn borer."
    },
    "Grape___Black_rot": {
        "crop": "Grape",
        "disease": "Black Rot",
        "pathogen": "Guignardia bidwellii (Fungus)",
        "status": "Infected",
        "severity": "Critical",
        "symptoms": "Small reddish-brown circular spots on leaves; tiny black pycnidia speckle the center of spots.",
        "organic_remedy": "Copper hydroxide or Bordeaux mixture; prune shoots to 50% open canopy.",
        "chemical_remedy": "Mancozeb, Ziram, or Kresoxim-methyl applied from bud break through 4 weeks post-bloom.",
        "prevention": "Remove and incinerate mummified berries hanging on vines or fallen to the vineyard floor."
    },
    "Grape___Esca_(Black_Measles)": {
        "crop": "Grape",
        "disease": "Esca (Black Measles)",
        "pathogen": "Phaeomoniella chlamydospora & Fomitiporia mediterranea",
        "status": "Infected",
        "severity": "High",
        "symptoms": "'Tiger-stripe' chlorotic and necrotic patterns between leaf veins; dark spots on berry skins.",
        "organic_remedy": "Prune out diseased arms with clean shears; apply wound sealant with Trichoderma harzianum.",
        "chemical_remedy": "No direct curative systemic fungicide exists; preventative wound protectants (Tebuconazole pastes) required.",
        "prevention": "Avoid pruning during rainy weather; sanitize shears between vines with 70% isopropyl alcohol."
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "crop": "Grape",
        "disease": "Leaf Blight (Isariopsis Leaf Spot)",
        "pathogen": "Pseudocercospora vitis (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Irregular dark brown lesions with dark violet halos on mature leaves, leading to premature defoliation.",
        "organic_remedy": "Bordeaux mixture (copper sulfate + lime) applied as protective barrier sprays.",
        "chemical_remedy": "Copper oxychloride or Carbendazim 50WP sprays.",
        "prevention": "Improve trellis canopy ventilation; avoid sprinkler irrigation hitting foliage."
    },
    "Grape___healthy": {
        "crop": "Grape",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Broad, vibrant palmate green leaves with intact veining and vigorous shoot tendrils.",
        "organic_remedy": "Foliar seaweed extract applications during berry set.",
        "chemical_remedy": "None required.",
        "prevention": "Maintain canopy management and balanced shoot positioning."
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop": "Orange / Citrus",
        "disease": "Citrus Greening (Huanglongbing / HLB)",
        "pathogen": "Candidatus Liberibacter asiaticus (Bacterium, vectored by Asian citrus psyllid)",
        "status": "Infected",
        "severity": "Critical",
        "symptoms": "Blotchy mottle yellowing across leaf blades asymmetrical to midrib; small, lopsided green fruit.",
        "organic_remedy": "Aggressive vector control using petroleum horticultural spray oils and parasitic wasps (Tamarixia radiata).",
        "chemical_remedy": "Systemic insecticides (Imidacloprid, Thiamethoxam) to suppress vector psyllid populations; trunk injections of oxytetracycline.",
        "prevention": "Use certified disease-free nursery stock; immediately eradicate and burn verified HLB-positive trees."
    },
    "Peach___Bacterial_spot": {
        "crop": "Peach",
        "disease": "Bacterial Spot",
        "pathogen": "Xanthomonas arboricola pv. pruni (Bacterium)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Angular water-soaked purple lesions that dry up and drop out, creating a 'shot-hole' appearance.",
        "organic_remedy": "Copper bactericides applied at dormant/bud-swell stages; avoid high-nitrogen fertilizers.",
        "chemical_remedy": "Oxytetracycline (Mycoshield) sprays during bloom and petal fall.",
        "prevention": "Plant resistant cultivars (e.g., Candor, Dixired); erect windbreaks to prevent sandy soil abrasion on leaves."
    },
    "Peach___healthy": {
        "crop": "Peach",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Lanceolate, bright green leaves with finely serrated margins and no shot-hole perforations.",
        "organic_remedy": "Dormant oil spray during winter to suppress scale insects and mites.",
        "chemical_remedy": "None required.",
        "prevention": "Ensure adequate soil drainage; prune center of tree for vase shape."
    },
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Pepper (Bell)",
        "disease": "Bacterial Spot",
        "pathogen": "Xanthomonas euvesicatoria (Bacterium)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Small, water-soaked, dark green to brown spots with greasy margins; infected leaves turn yellow and drop.",
        "organic_remedy": "Copper hydroxide mixed with Bacillus amyloliquefaciens bio-bactericide.",
        "chemical_remedy": "Fixed copper sprays tank-mixed with Mancozeb to overcome copper-resistant bacterial strains.",
        "prevention": "Hot-water seed treatment (50°C for 25 min); 3-year crop rotation away from Solanaceae."
    },
    "Pepper,_bell___healthy": {
        "crop": "Pepper (Bell)",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Glossy, uniform deep-green leaves with sturdy branching and zero mottling.",
        "organic_remedy": "Apply calcium nitrate or bone meal to prevent blossom-end rot.",
        "chemical_remedy": "None required.",
        "prevention": "Mulch soil with straw or black plastic; utilize drip irrigation."
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early Blight",
        "pathogen": "Alternaria solani (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Target-like dark brown spots with concentric rings surrounded by a chlorotic yellow halo.",
        "organic_remedy": "Copper octanoate sprays; prune bottom foliage touching wet soil.",
        "chemical_remedy": "Chlorothalonil (Bravo), Mancozeb, or Azoxystrobin (Quadris) applied every 7-10 days.",
        "prevention": "Ensure balanced nutrition; avoid overhead watering; allow foliage to dry completely before sunset."
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late Blight",
        "pathogen": "Phytophthora infestans (Oomycete)",
        "status": "Infected",
        "severity": "Critical",
        "symptoms": "Large, irregular water-soaked dark green/black lesions with fuzzy white mildew on leaf undersides in high humidity.",
        "organic_remedy": "Copper soap or Bordeaux mixture applied proactively; burn infected vines before harvest.",
        "chemical_remedy": "Fluopicolide, Mandipropamid (Revus), or Metalaxyl-M (Ridomil Gold) for systemic protection.",
        "prevention": "Plant certified seed tubers; destroy volunteer potato cull piles; scout field daily during cool, wet weather."
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Compound, lush dark green foliage free of necrotic rings or fungal fuzz.",
        "organic_remedy": "Side-dress with balanced potassium-rich organic fertilizer.",
        "chemical_remedy": "None required.",
        "prevention": "Hill potatoes properly to protect developing tubers from sun and spores."
    },
    "Raspberry___healthy": {
        "crop": "Raspberry",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Pinnately compound leaves with silvery undersides and serrated edges in prime condition.",
        "organic_remedy": "Apply compost mulch around canes; trellis canes off ground.",
        "chemical_remedy": "None required.",
        "prevention": "Prune spent floricanes immediately after fruiting."
    },
    "Soybean___healthy": {
        "crop": "Soybean",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Trifoliate, vibrant emerald leaves without vein clearing or insect defoliation.",
        "organic_remedy": "Inoculate seeds with Bradyrhizobium japonicum for organic nitrogen fixation.",
        "chemical_remedy": "None required.",
        "prevention": "Maintain optimal row spacing to discourage white mold."
    },
    "Squash___Powdery_mildew": {
        "crop": "Squash",
        "disease": "Powdery Mildew",
        "pathogen": "Podosphaera xanthii (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Circular talcum-powder white fungal patches covering leaves, stems, and petioles; leaves senesce prematurely.",
        "organic_remedy": "Spray with dilute milk solution (40% milk / 60% water) or neem oil + potassium bicarbonate.",
        "chemical_remedy": "Myclobutanil, Trifloxystrobin, or Boscalid protectant sprays.",
        "prevention": "Select PM-resistant squash cultivars; plant in full sun with wide spacing."
    },
    "Strawberry___Leaf_scorch": {
        "crop": "Strawberry",
        "disease": "Leaf Scorch",
        "pathogen": "Diplocarpon earlianum (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Irregular purple or reddish blotches on leaves that enlarge and cause entire leaf margins to brown and scorch.",
        "organic_remedy": "Remove old infected leaves after renovation; avoid overhead sprinkler irrigation.",
        "chemical_remedy": "Captan, Thiram, or Pyraclostrobin sprays during early leaf emergence.",
        "prevention": "Plant disease-free runner plants; space plants to promote rapid drying."
    },
    "Strawberry___healthy": {
        "crop": "Strawberry",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Lush trifoliate green leaves with crisp serrations and vigorous crown growth.",
        "organic_remedy": "Mulch beds with clean pine straw or black weed matting.",
        "chemical_remedy": "None required.",
        "prevention": "Renovate June-bearing beds annually after harvest."
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease": "Bacterial Spot",
        "pathogen": "Xanthomonas spp. (Bacterium)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Small (under 3mm) dark brown, water-soaked circular spots with yellow halos; leaf drops readily.",
        "organic_remedy": "Copper octanoate or copper hydroxide combined with Bacillus subtilis.",
        "chemical_remedy": "Fixed copper mixed with Mancozeb (protectant); streptomycin on greenhouse seedlings.",
        "prevention": "Do not work with plants while foliage is wet; buy certified pathogen-free seeds."
    },
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "pathogen": "Alternaria linariae / Alternaria solani (Fungus)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Dark brown spots with concentric target-board rings on older, lower leaves; yellowing surrounds the spots.",
        "organic_remedy": "Prune lower 12 inches of foliage; spray liquid copper fungicide or Serenade bio-fungicide weekly.",
        "chemical_remedy": "Chlorothalonil (Daconil), Azoxystrobin, or Mancozeb sprays at first sign.",
        "prevention": "Stake and cage tomatoes to elevate foliage; apply organic straw mulch to stop soil splashing."
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late Blight",
        "pathogen": "Phytophthora infestans (Oomycete)",
        "status": "Infected",
        "severity": "Critical",
        "symptoms": "Large, greasy-looking water-soaked lesions that quickly turn dark brown/black; white fungal bloom underneath in high humidity.",
        "organic_remedy": "Copper soap fungicide immediately upon detection; rogue and destroy infected plants if outbreak is severe.",
        "chemical_remedy": "Mandipropamid (Revus), Cymoxanil (Curzate), or Dimethomorph (Acrobat).",
        "prevention": "Eliminate volunteer potatoes and nightshades nearby; monitor regional USABlight forecasts."
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease": "Leaf Mold",
        "pathogen": "Passalora fulva (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Pale greenish-yellow spots with indistinct margins on upper surface; velvety olive-green mold on corresponding undersides.",
        "organic_remedy": "Reduce greenhouse relative humidity below 85%; apply copper or bio-fungicides.",
        "chemical_remedy": "Chlorothalonil, Fenamidone, or Cyazofamid sprays.",
        "prevention": "Ensure high greenhouse ventilation; space plants widely; heat greenhouse slightly at night to stop condensation."
    },
    "Tomato___Septoria_leaf_spot": {
        "crop": "Tomato",
        "disease": "Septoria Leaf Spot",
        "pathogen": "Septoria lycopersici (Fungus)",
        "status": "Infected",
        "severity": "High",
        "symptoms": "Numerous small circular spots (1-3mm) with light gray or tan centers and dark brown borders; black pycnidia specks inside.",
        "organic_remedy": "Prune out infected lower leaves; spray copper sulfate pentahydrate; apply 3 inches of wood chip mulch.",
        "chemical_remedy": "Chlorothalonil or Mancozeb every 7-14 days starting at transplanting.",
        "prevention": "Strict 3-year crop rotation; avoid overhead irrigation; clean cages with 10% bleach solution."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "crop": "Tomato",
        "disease": "Two-Spotted Spider Mite Infestation",
        "pathogen": "Tetranychus urticae (Arachnid Pest)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Fine yellow or white stippling on leaf surface; heavy infestations produce delicate silken webbing on leaf undersides.",
        "organic_remedy": "Insecticidal soap, neem oil, rosemary oil, or release predatory mites (Phytoseiulus persimilis).",
        "chemical_remedy": "Abamectin (Agri-Mek), Bifenazate (Acramite), or Spiromesifen (Oberon).",
        "prevention": "Keep plants adequately watered during hot, dry spells; spray under leaves with water blasts to dislodge mites."
    },
    "Tomato___Target_Spot": {
        "crop": "Tomato",
        "disease": "Target Spot",
        "pathogen": "Corynespora cassiicola (Fungus)",
        "status": "Infected",
        "severity": "Moderate",
        "symptoms": "Small brown pinpoint lesions expanding into circular lesions with light brown centers and dark margins (target-like).",
        "organic_remedy": "Copper fungicides and Bacillus amyloliquefaciens; strip lower infected leaves.",
        "chemical_remedy": "Azoxystrobin + Difenoconazole (Quadris Top) or Famoxadone + Cymoxanil.",
        "prevention": "Ensure good air circulation; avoid excessive overhead irrigation; remove solanaceous weeds."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "disease": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "pathogen": "Begomovirus (vectored by Silverleaf Whitefly Bemisia tabaci)",
        "status": "Infected",
        "severity": "Critical",
        "symptoms": "Severe upward cupping of leaves; prominent chlorotic yellow margins; stunted bushy plant growth; flower abscission.",
        "organic_remedy": "Aggressive whitefly control: yellow sticky traps, insecticidal soap, and reflective silver mulches.",
        "chemical_remedy": "Systemic neonicotinoids or Diamides (Cyantraniliprole) targeted at whitefly nymphs.",
        "prevention": "Grow resistant cultivars (Ty-1 or Ty-3 gene hybrids); install fine insect netting (50-mesh) on greenhouse vents."
    },
    "Tomato___Tomato_mosaic_virus": {
        "crop": "Tomato",
        "disease": "Tomato Mosaic Virus (ToMV)",
        "pathogen": "Tobamovirus (Mechanically transmitted virus)",
        "status": "Infected",
        "severity": "Critical",
        "symptoms": "Mottled light and dark green mosaic patterns on leaves; 'shoestring' leaf distortion; stunted plant growth.",
        "organic_remedy": "No cure exists; immediately bag, remove, and discard infected plants; wash hands in skim milk to deactivate virus.",
        "chemical_remedy": "No chemical control exists for viral pathogens.",
        "prevention": "Wash hands with soap before touching plants; smokers must sanitize hands (tobacco harbors virus); use ToMV-resistant seeds."
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy Leaf",
        "pathogen": "None",
        "status": "Healthy",
        "severity": "None",
        "symptoms": "Deep green, robust serrated compound leaves with strong turgor and zero chlorosis, mottling, or lesions.",
        "organic_remedy": "Regular foliar feeding with dilute fish and kelp emulsion; maintain consistent deep watering.",
        "chemical_remedy": "None required.",
        "prevention": "Stake plants upright, maintain 2-3 inches of straw mulch, and prune suckers to promote air flow."
    }
}

CLASSES_LIST = sorted(list(DISEASE_METADATA.keys()))
assert len(CLASSES_LIST) == 38, f"Expected 38 classes, got {len(CLASSES_LIST)}"
