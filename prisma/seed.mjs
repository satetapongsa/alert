import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed on Neon PostgreSQL...');

  // 1. Create Default Admin & Trusted Reporters
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@bkk-map.go.th',
      name: 'ผู้ดูแลระบบส่วนกลาง (BMA Admin)',
      role: 'ADMIN',
      reputation: 100,
    },
  });

  const reporterSomchai = await prisma.user.upsert({
    where: { username: 'somchai' },
    update: {},
    create: {
      username: 'somchai',
      email: 'somchai@citizen.th',
      name: 'สมชาย รักเมือง',
      role: 'TRUSTED_REPORTER',
      reputation: 45,
    },
  });

  const reporterWirote = await prisma.user.upsert({
    where: { username: 'wirote' },
    update: {},
    create: {
      username: 'wirote',
      email: 'wirote@transit.th',
      name: 'วิโรจน์ เดินทางปลอดภัย',
      role: 'USER',
      reputation: 25,
    },
  });

  console.log('✅ Users created:', { adminUser: adminUser.username, reporterSomchai: reporterSomchai.username });

  // 2. Create Transit Lines & Stations
  const btsSukhumvit = await prisma.transportLine.upsert({
    where: { id: 'bts-sukhumvit' },
    update: {},
    create: {
      id: 'bts-sukhumvit',
      name: 'BTS สายสุขุมวิท',
      nameEn: 'BTS Sukhumvit Line',
      type: 'BTS',
      colorCode: '#22c55e',
      status: 'DELAYED',
      statusDetail: 'ขบวนรถล่าช้าบริเวณสถานีอโศก - พร้อมพงษ์ ประมาณ 5-10 นาที เนื่องจากระบบอาณัติสัญญาณขัดข้องชั่วคราว',
      stations: {
        create: [
          { id: 'bts-mochit', code: 'N8', name: 'หมอชิต', nameEn: 'Mo Chit', latitude: 13.8024, longitude: 100.5539, status: 'NORMAL' },
          { id: 'bts-ari', code: 'N5', name: 'อารีย์', nameEn: 'Ari', latitude: 13.7749, longitude: 100.5422, status: 'NORMAL' },
          { id: 'bts-phayathai', code: 'N2', name: 'พญาไท', nameEn: 'Phaya Thai', latitude: 13.7539, longitude: 100.5348, status: 'NORMAL' },
          { id: 'bts-siam', code: 'CEN', name: 'สยาม', nameEn: 'Siam', latitude: 13.7460, longitude: 100.5347, status: 'NORMAL' },
          { id: 'bts-asok', code: 'E4', name: 'อโศก', nameEn: 'Asok', latitude: 13.7371, longitude: 100.5604, status: 'DELAYED' },
          { id: 'bts-phromphong', code: 'E5', name: 'พร้อมพงษ์', nameEn: 'Phrom Phong', latitude: 13.7303, longitude: 100.5698, status: 'DELAYED' },
          { id: 'bts-thonglo', code: 'E6', name: 'ทองหล่อ', nameEn: 'Thong Lo', latitude: 13.7203, longitude: 100.5841, status: 'NORMAL' },
          { id: 'bts-onnut', code: 'E9', name: 'อ่อนนุช', nameEn: 'On Nut', latitude: 13.7025, longitude: 100.6053, status: 'NORMAL' },
        ],
      },
    },
  });

  const mrtBlue = await prisma.transportLine.upsert({
    where: { id: 'mrt-blue' },
    update: {},
    create: {
      id: 'mrt-blue',
      name: 'MRT สายสีน้ำเงิน',
      nameEn: 'MRT Blue Line',
      type: 'MRT',
      colorCode: '#2563eb',
      status: 'NORMAL',
      statusDetail: 'การเดินรถปกติทุกสถานี ความถี่ 4 นาที',
      stations: {
        create: [
          { id: 'mrt-bangsue', code: 'BL11', name: 'บางซื่อ', nameEn: 'Bang Sue', latitude: 13.8038, longitude: 100.5375, status: 'NORMAL' },
          { id: 'mrt-chatuchak', code: 'BL13', name: 'สวนจตุจักร', nameEn: 'Chatuchak Park', latitude: 13.8024, longitude: 100.5539, status: 'NORMAL' },
          { id: 'mrt-phraram9', code: 'BL20', name: 'พระราม 9', nameEn: 'Phra Ram 9', latitude: 13.7578, longitude: 100.5649, status: 'NORMAL' },
          { id: 'mrt-sukhumvit', code: 'BL22', name: 'สุขุมวิท', nameEn: 'Sukhumvit', latitude: 13.7371, longitude: 100.5604, status: 'NORMAL' },
        ],
      },
    },
  });

  console.log('✅ Transit lines created');

  // 3. Create Seed Incidents
  const incidentFlood = await prisma.incident.create({
    data: {
      type: 'FLOOD',
      title: 'น้ำท่วมขังผิวจราจร ถนนรัชดาภิเษก',
      description: 'มีน้ำท่วมขังสูงประมาณ 30–40 ซม. หน้าศาลอาญา มุ่งหน้าแยกลาดพร้าว รถเล็กสัญจรลำบาก แนะนำเลี่ยงเส้นทาง',
      latitude: 13.8185,
      longitude: 100.5750,
      locationName: 'ถนนรัชดาภิเษก หน้าศาลอาญา',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      severity: 'MEDIUM',
      status: 'ACTIVE',
      source: 'COMMUNITY',
      confidence: 'COMMUNITY_VERIFIED',
      confirmCount: 28,
      disputeCount: 1,
      createdById: reporterSomchai.id,
      metadata: {
        waterLevelCm: 35,
        waterLevelCategory: '30-50cm',
        smallCarPassable: false,
        largeTruckPassable: true,
        roadBlocked: false,
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
            caption: 'น้ำท่วมขังหน้าศาลอาญาสูงระดับฟุตบาท',
          },
        ],
      },
      updates: {
        create: [
          { action: 'CREATED', description: 'รายงานเหตุการณ์น้ำท่วมขัง 30-40 ซม.' },
          { action: 'VERIFIED', description: 'ผู้ใช้งาน 28 คนยืนยันข้อมูล' },
        ],
      },
      comments: {
        create: [
          {
            userName: 'วินมอเตอร์ไซค์รัชดา',
            message: 'เลนซ้ายท่วมมิดฟุตบาท รถเก๋งโหลดเตี้ยอย่ามาเด็ดขาดครับ ให้วิ่งเลนขวาสุดเท่านั้น',
          },
        ],
      },
    },
  });

  const incidentTraffic = await prisma.incident.create({
    data: {
      type: 'TRAFFIC',
      title: 'รถติดหนัก ถนนวิภาวดีรังสิต ขาออก',
      description: 'การจราจรติดขัดสะสมยาวกว่า 3.4 กม. ความเร็วเฉลี่ย 12 km/h สาเหตุจากอุบัติเหตุช่องด่วน มุ่งหน้าดอนเมือง',
      latitude: 13.8249,
      longitude: 100.5630,
      locationName: 'ถนนวิภาวดีรังสิต ขาออก หน้าดอนเมือง',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      severity: 'HIGH',
      status: 'ACTIVE',
      source: 'COMMUNITY',
      confidence: 'COMMUNITY_VERIFIED',
      confirmCount: 45,
      disputeCount: 0,
      createdById: reporterWirote.id,
      metadata: {
        speedKmh: 12,
        queueLengthKm: 3.4,
        cause: 'อุบัติเหตุรถเฉี่ยวชนช่องทางด่วน',
        direction: 'ขาออก มุ่งหน้าดอนเมือง',
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
            caption: 'แถวรถสะสมยาวตั้งแต่หน้าห้าแยกลาดพร้าว',
          },
        ],
      },
    },
  });

  const incidentAccident = await prisma.incident.create({
    data: {
      type: 'ACCIDENT',
      title: 'อุบัติเหตุรถยนต์ 3 คัน กีดขวาง 2 ช่องทาง',
      description: 'ถนนพระราม 9 ขาเข้า มุ่งหน้าแยก อสมท. รถเก๋งชนท้ายกัน 3 คัน กีดขวางเลนขวาและเลนกลาง',
      latitude: 13.7578,
      longitude: 100.5649,
      locationName: 'ถนนพระราม 9 แยก อสมท.',
      district: 'ห้วยขวาง',
      province: 'กรุงเทพมหานคร',
      severity: 'CRITICAL',
      status: 'ACTIVE',
      source: 'COMMUNITY',
      confidence: 'OFFICIAL_VERIFIED',
      confirmCount: 19,
      disputeCount: 0,
    },
  });

  const incidentTransit = await prisma.incident.create({
    data: {
      type: 'TRANSIT',
      title: 'BTS สายสุขุมวิท ขบวนรถล่าช้าช่วง อโศก - พร้อมพงษ์',
      description: 'ขบวนรถไฟฟ้าล่าช้า 5-10 นาที เนื่องจากระบบอาณัติสัญญาณขัดข้องชั่วคราว',
      latitude: 13.7371,
      longitude: 100.5604,
      locationName: 'สถานีรถไฟฟ้า BTS อโศก',
      district: 'วัฒนา',
      province: 'กรุงเทพมหานคร',
      severity: 'MEDIUM',
      status: 'ACTIVE',
      confirmCount: 52,
      disputeCount: 2,
    },
  });

  console.log('✅ Incidents created:', [
    incidentFlood.title,
    incidentTraffic.title,
    incidentAccident.title,
    incidentTransit.title,
  ]);

  // 4. Create Audit Log
  await prisma.auditLog.create({
    data: {
      adminId: adminUser.id,
      action: 'SYSTEM_INIT',
      targetType: 'SYSTEM',
      targetId: 'init-seed',
      details: 'เริ่มต้นระบบฐานข้อมูลบน Neon PostgreSQL สำเร็จ',
    },
  });

  console.log('🎉 Seed completed successfully on Neon PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
