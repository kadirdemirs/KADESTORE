import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...");

  // Admin kullanıcı
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kadestore.com" },
    update: {},
    create: { email: "admin@kadestore.com", name: "Admin", password: adminPassword, role: "admin" },
  });

  // Test kullanıcı
  const userPassword = await bcrypt.hash("user123", 10);
  await prisma.user.upsert({
    where: { email: "test@kadestore.com" },
    update: {},
    create: { email: "test@kadestore.com", name: "Ahmet K.", password: userPassword, role: "user", points: 5 },
  });

  // Oyunlar
  const games = [
    { title: "LEGO Batman Legacy of the Dark Knight Delux", slug: "lego-batman-dark-knight-delux", description: "Batman olarak LEGO dünyasında Gotham şehrini kötülüklerden koru. Aksiyon dolu bulmacalar ve eğlenceli karakterlerle dolu bir macera.", platform: "Steam", genre: "Aksiyon", price: 89.99, isFeatured: true },
    { title: "007 First Light Delux", slug: "007-first-light-delux", description: "James Bond'un gençlik yıllarını anlatan bu aksiyon oyununda dünyayı kurtarın. Nişancılık, araç kovalamacası ve casusluk görevleri sizi bekliyor.", platform: "Steam", genre: "Aksiyon", price: 149.99, isFeatured: true },
    { title: "Forza 6 Premium", slug: "forza-6-premium", description: "Dünyanın en prestijli yarış pistlerinde yüzlerce gerçek araçla yarışın. Gerçekçi fizik motoru ve etkileyici grafikleriyle sinematik bir yarış deneyimi.", platform: "Steam", genre: "Spor", price: 199.99, isFeatured: true },
    { title: "Cyberpunk 2077", slug: "cyberpunk-2077", description: "Neon ışıklarıyla aydınlanan Night City'de bir paralı askerin hayatta kalma mücadelesi. Özgür dünya, derinlemesine hikaye ve sonsuz özelleştirme seçenekleri.", platform: "Steam", genre: "RPG", price: 249.99 },
    { title: "The Witcher 3: Wild Hunt", slug: "the-witcher-3-wild-hunt", description: "Canavarları avlamak için dolaşan bir yaratık avcısının epik macerası. Açık dünya RPG'sinin zirvesi.", platform: "Steam", genre: "RPG", price: 59.99 },
    { title: "FIFA 25", slug: "fifa-25", description: "Dünyanın en popüler futbol oyununun yeni sezonu. Gerçekçi oynanış ve güncel kadro transferleri.", platform: "Steam", genre: "Spor", price: 299.99 },
    { title: "Minecraft Java Edition", slug: "minecraft-java-edition", description: "Blok dünyasında sonsuz yaratıcılık. İnşa et, keşfet, hayatta kal.", platform: "Steam", genre: "Simülasyon", price: 119.99 },
    { title: "Red Dead Redemption 2", slug: "red-dead-redemption-2", description: "Vahşi Batı'nın son dönemini anlatan epik bir gangster destanı. Açık dünya ve filmsel anlatıcılık.", platform: "Steam", genre: "Aksiyon", price: 179.99 },
    { title: "Stardew Valley", slug: "stardew-valley", description: "Şehir hayatından kaçıp bir çiftliğe taşınan karakterinizle sakin bir köy hayatı yaşayın.", platform: "Steam", genre: "Simülasyon", price: 39.99 },
    { title: "Portal 2", slug: "portal-2", description: "Fizik tabanlı bulmacalar ve esprili anlatımıyla Portal serisinin şaheseri.", platform: "Steam", genre: "Bulmaca", price: 29.99 },
  ];

  for (const game of games) {
    const created = await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: {
        title: game.title,
        slug: game.slug,
        description: game.description,
        platform: game.platform,
        genre: game.genre,
        price: game.price,
        isActive: true,
        isFeatured: game.isFeatured === true,
      },
    });

    // Her oyuna 5 anahtar ekle
    const existingKeys = await prisma.gameKey.count({ where: { gameId: created.id } });
    if (existingKeys === 0) {
      await prisma.gameKey.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          gameId: created.id,
          key: `${game.slug.toUpperCase().slice(0, 5)}-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        })),
        skipDuplicates: true,
      });
    }
  }

  console.log("✅ Seed tamamlandı!");
  console.log("👤 Admin: admin@kadestore.com / admin123");
  console.log("👤 Test kullanıcı: test@kadestore.com / user123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
