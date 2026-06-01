const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@kadestore.com" },
    update: {},
    create: { email: "admin@kadestore.com", name: "Admin", password: adminPassword, role: "admin" },
  });

  const userPassword = await bcrypt.hash("user123", 10);
  const testUser = await prisma.user.upsert({
    where: { email: "test@kadestore.com" },
    update: {},
    create: { email: "test@kadestore.com", name: "Ahmet K.", password: userPassword, role: "user", points: 5 },
  });

  // Geçerli 20-byte base64 shared_secret örnekleri (Steam Guard kodu üretebilir)
  const SECRET_A = "a2FkZXN0b3JlU2VjcmV0MTIzNDU=";

  // Steam library_600x900 (2:3 portrait, kartlarımıza mükemmel oturur)
  const IMG = (appid) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;

  // Türkiye 2026 piyasa fiyatlarına yakın realistik fiyatlandırma
  // KadeStore "uygun fiyat" iddiası — Steam fiyatının %10-25 altı
  const games = [
    // --- 2024-2025'in en çok aranan/satın alınanları ---
    { title: "Grand Theft Auto V Premium Edition", slug: "gta-v-premium", description: "Los Santos'ta üç ana karakterle açık dünya suç simülasyonu. GTA Online dahil.", platform: "Steam", genre: "Aksiyon", price: 499.00, isFeatured: true, imageUrl: IMG(271590) },
    { title: "Counter-Strike 2 Prime Status", slug: "cs2-prime", description: "FPS efsanesi CS2 için Prime Status — özel matchmaking ve drop avantajları.", platform: "Steam", genre: "Aksiyon", price: 149.00, isFeatured: true, deliveryType: "account", imageUrl: IMG(730) },
    { title: "EA SPORTS FC 25 (FIFA 25)", slug: "fifa-25", description: "Dünyanın en popüler futbol oyununun yeni sezonu. Ultimate Team, Career, Clubs modları.", platform: "Steam", genre: "Spor", price: 1999.00, isFeatured: true, imageUrl: IMG(2669320) },
    { title: "Hogwarts Legacy", slug: "hogwarts-legacy", description: "Hogwarts'ta 1800'lerin sonunda geçen RPG. Kendi büyücünü yarat, büyüler öğren.", platform: "Steam", genre: "RPG", price: 1699.00, isFeatured: true, imageUrl: IMG(990080) },
    { title: "Cyberpunk 2077", slug: "cyberpunk-2077", description: "Night City'de bir paralı askerin hayatta kalma mücadelesi. Phantom Liberty DLC dahil.", platform: "Steam", genre: "RPG", price: 899.00, isFeatured: true, imageUrl: IMG(1091500) },
    { title: "Elden Ring", slug: "elden-ring", description: "FromSoftware'in açık dünya soulslike şaheseri. Lands Between'de epik macera.", platform: "Steam", genre: "RPG", price: 1199.00, isFeatured: true, imageUrl: IMG(1245620) },
    { title: "Baldur's Gate 3", slug: "baldurs-gate-3", description: "D&D evreninde sıra tabanlı RPG. 2023'ün GOTY ödülünün sahibi.", platform: "Steam", genre: "RPG", price: 1799.00, imageUrl: IMG(1086940) },
    { title: "Red Dead Redemption 2", slug: "red-dead-redemption-2", description: "Vahşi Batı'nın son dönemini anlatan epik bir gangster destanı.", platform: "Steam", genre: "Macera", price: 899.00, imageUrl: IMG(1174180) },
    { title: "Call of Duty: Black Ops 6", slug: "cod-black-ops-6", description: "CoD serisinin en yeni halkası. Multiplayer, Zombies ve kampanya modları.", platform: "Steam", genre: "Aksiyon", price: 2299.00, imageUrl: IMG(2611660) },
    { title: "Black Myth: Wukong", slug: "black-myth-wukong", description: "Çin mitolojisinden ilham alan aksiyon-RPG. 2024'ün en konuşulan oyunu.", platform: "Steam", genre: "Aksiyon", price: 1599.00, isFeatured: true, imageUrl: IMG(2358720) },

    // --- Sürekli yüksek talep gören oyunlar ---
    { title: "The Witcher 3: Wild Hunt — Complete Edition", slug: "the-witcher-3-wild-hunt", description: "Geralt'ın efsanevi epik RPG'si. Tüm DLC'ler ve next-gen güncellemesi dahil.", platform: "Steam", genre: "RPG", price: 179.00, imageUrl: IMG(292030) },
    { title: "Resident Evil 4 (Remake)", slug: "resident-evil-4-remake", description: "Korku-aksiyon klasiğinin modern remake'i. Leon S. Kennedy'nin kabusu.", platform: "Steam", genre: "Aksiyon", price: 1099.00, imageUrl: IMG(2050650) },
    { title: "Helldivers 2", slug: "helldivers-2", description: "4 kişilik koop kaotik 3. şahıs nişancı. Demokrasiyi galaksiye yay.", platform: "Steam", genre: "Aksiyon", price: 1099.00, imageUrl: IMG(553850) },
    { title: "God of War", slug: "god-of-war", description: "Kratos ve Atreus'un İskandinav mitolojisindeki ilk macerası.", platform: "Steam", genre: "Macera", price: 899.00, imageUrl: IMG(1593500) },
    { title: "Marvel's Spider-Man Remastered", slug: "spider-man-remastered", description: "New York'ta süper kahraman olmanın PC sürümü.", platform: "Steam", genre: "Aksiyon", price: 1199.00, imageUrl: IMG(1817070) },
    { title: "The Last of Us Part I", slug: "the-last-of-us-part-1", description: "Joel ve Ellie'nin post-apokaliptik epik hikayesi.", platform: "Steam", genre: "Macera", price: 2199.00, imageUrl: IMG(1888930) },
    { title: "Sons of the Forest", slug: "sons-of-the-forest", description: "Hayatta kalma korkusu. Kanibal ormanda bir bakanın peşindesin.", platform: "Steam", genre: "Macera", price: 449.00, imageUrl: IMG(1326470) },
    { title: "ARK: Survival Ascended", slug: "ark-survival-ascended", description: "Dinozorlarla hayatta kalma sandbox'ının Unreal Engine 5 remake'i.", platform: "Steam", genre: "Simülasyon", price: 1299.00, imageUrl: IMG(2399830) },

    // --- Indie / Strateji / Bulmaca klasikleri ---
    { title: "Minecraft Java & Bedrock Edition", slug: "minecraft-java-edition", description: "Blok dünyasında sonsuz yaratıcılık. Microsoft hesabınıza tanımlanır.", platform: "PC", genre: "Simülasyon", price: 899.00, deliveryType: "account", imageUrl: IMG(1672970) },
    { title: "Stardew Valley", slug: "stardew-valley", description: "Şehir hayatından kaçıp bir çiftliğe taşınan karakterinle sakin köy hayatı.", platform: "Steam", genre: "Simülasyon", price: 149.00, imageUrl: IMG(413150) },
    { title: "Portal 2", slug: "portal-2", description: "Fizik tabanlı bulmacalar ve esprili anlatımıyla Portal serisinin şaheseri.", platform: "Steam", genre: "Bulmaca", price: 49.00, imageUrl: IMG(620) },
    { title: "Forza Horizon 5 Premium", slug: "forza-horizon-5-premium", description: "Meksika'nın muhteşem manzaralarında 500+ araçla açık dünya yarış.", platform: "Steam", genre: "Spor", price: 1299.00, imageUrl: IMG(1551360) },

    // --- Yeni çıkacak / Featured ---
    { title: "007 First Light Deluxe", slug: "007-first-light-delux", description: "James Bond'un gençlik yıllarını anlatan aksiyon oyunu. 2026'da gelen yeni IO Interactive yapımı.", platform: "Steam", genre: "Aksiyon", price: 1499.00, isFeatured: true, deliveryType: "account", imageUrl: IMG(1659040) },
    { title: "LEGO Batman: Legacy of the Dark Knight", slug: "lego-batman-dark-knight-delux", description: "Batman olarak LEGO dünyasında Gotham şehrini kötülüklerden koru. Aile dostu.", platform: "Steam", genre: "Aksiyon", price: 299.00, imageUrl: IMG(368020) },
  ];

  for (const game of games) {
    const created = await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        title: game.title,
        description: game.description,
        platform: game.platform,
        genre: game.genre,
        price: game.price,
        imageUrl: game.imageUrl || "",
        isFeatured: game.isFeatured || false,
        deliveryType: game.deliveryType || "key",
      },
      create: {
        title: game.title,
        slug: game.slug,
        description: game.description,
        platform: game.platform,
        genre: game.genre,
        price: game.price,
        imageUrl: game.imageUrl || "",
        isActive: true,
        isFeatured: game.isFeatured || false,
        deliveryType: game.deliveryType || "key",
      },
    });

    const existingKeys = await prisma.gameKey.count({ where: { gameId: created.id } });
    if (existingKeys === 0) {
      if (game.deliveryType === "account") {
        // Hazır hesap stoğu
        const accData = [];
        for (let i = 1; i <= 8; i++) {
          accData.push({
            gameId: created.id,
            key: `ACC-${game.slug.slice(0, 4).toUpperCase()}-${i.toString().padStart(3, "0")}`,
            steamUsername: `CovertDrake${4650 + i}`,
            steamPassword: Math.random().toString(36).slice(2, 12),
            sharedSecret: SECRET_A,
            accountNote: `Hesap ${i}`,
          });
        }
        await prisma.gameKey.createMany({ data: accData });

        // Test kullanıcısına ilk hesabı ata (ekran görüntülerindeki senaryo)
        const firstAcc = await prisma.gameKey.findFirst({ where: { gameId: created.id }, orderBy: { key: "asc" } });
        if (firstAcc) {
          await prisma.gameKey.update({ where: { id: firstAcc.id }, data: { isUsed: true } });
          await prisma.userKey.create({
            data: { userId: testUser.id, gameKeyId: firstAcc.id, source: "purchase" },
          });
          await prisma.user.update({ where: { id: testUser.id }, data: { points: { increment: 1 } } });
        }
      } else {
        const keyData = [];
        for (let i = 0; i < 5; i++) {
          keyData.push({
            gameId: created.id,
            key: `${game.slug.slice(0, 5).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          });
        }
        await prisma.gameKey.createMany({ data: keyData });
      }
    }
  }

  console.log("✅ Seed tamamlandı!");
  console.log("👤 Admin: admin@kadestore.com / admin123");
  console.log("👤 Test: test@kadestore.com / user123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
