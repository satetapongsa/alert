# 🇹🇭 Thailand Real-Time Community Incident & Situation Map
### แผนที่รายงานสถานการณ์และเหตุการณ์เรียลไทม์ของประเทศไทย

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-16a34a?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Dark_Matter-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)

> **"แผนที่สถานการณ์แบบ Real-Time ที่ประชาชนช่วยกันรายงาน"**
> แพลตฟอร์มรายงานและติดตามสถานการณ์ภัยพิบัติ การจราจร น้ำท่วม อุบัติเหตุ และระบบรถไฟฟ้าขนส่งมวลชน (BTS, MRT, ARL, SRT) ในกรุงเทพฯ และประเทศไทยแบบเรียลไทม์ พร้อมระบบยืนยันความถูกต้องโดยชุมชน (Community Verification)

---

## 🌟 จุดเด่นของระบบ (Key Features)

### 1. 🗺️ แผนที่สถานการณ์แบบเต็มหน้าจอ (High-Contrast Dark Map)
- ฐานแผนที่ธีมมืด (CartoDB Dark Matter) อ่านง่าย สบายตา ไม่รบกวนการมองเห็น
- **Custom Animated Pulse Markers**: หมุดเหตุการณ์ระดับวิกฤต (Critical) และระดับสูง (High) มีเรดาร์กระจายคลื่นแบบอนิเมชัน
- **ระบบจัดกลุ่มและคัดกรอง**: กรองเหตุการณ์ตามประเภท (น้ำท่วม, รถติด, อุบัติเหตุ, ถนนปิด, รถไฟฟ้า, ฉุกเฉิน) และช่วงเวลา (LIVE, 1 ชม., 3 ชม., 6 ชม., วันนี้, 24 ชม., 7 วัน, ประวัติย้อนหลัง)
- **ระบบค้นหาอัจฉริยะ**: ค้นหาตามชื่อถนน, สี่แยก, เขต, สถานีรถไฟฟ้า หรือคำสำคัญในเหตุการณ์ พร้อมฟังก์ชันบินไปยังพิกัด (Fly-To) ทันที

### 2. ⚡ ระบบถ่ายทอดสดแบบ Real-Time (Server-Sent Events)
- เมื่อมีผู้รายงานเหตุการณ์ใหม่ หมุดจะปรากฏบนแผนที่ของผู้ใช้งานทุกคนพร้อมกันทันที **โดยไม่ต้องรีเฟรชหน้าเว็บ**
- รองรับเหตุการณ์ `incident.created`, `incident.updated`, `incident.confirmed`, `incident.disputed`, `incident.resolved`
- Toast Notification แจ้งเตือนเหตุการณ์ด่วนทันทีเมื่อเกิดเหตุใกล้เคียง

### 3. 🚇 ระบบติดตามสถานะรถไฟฟ้าขนส่งมวลชน (Transit Layer & Dashboard)
- แสดงเส้นทางและสถานีของระบบขนส่งมวลชนในกรุงเทพฯ ครบวงจร:
  - 🟢 **BTS สายสุขุมวิท & สายสีลม**
  - 🔵 **MRT สายสีน้ำเงิน, สีม่วง, สีเหลือง, สีชมพู**
  - 🔴 **Airport Rail Link (ARL)**
  - 🔴 **SRT สายสีแดงเข้ม & สีแดงอ่อน**
- หน้าเฉพาะทาง `/transport` รายงานความล่าช้า (Delays), จุดขัดข้อง (Disruptions), และสถานีที่ได้รับผลกระทบ

### 4. 📝 ระบบรายงานเหตุการณ์ 5 ขั้นตอน (5-Step Report Wizard)
1. **เลือกประเภทเหตุการณ์** (น้ำท่วม, รถติด, อุบัติเหตุ, ถนนปิด, รถไฟฟ้า, ฉุกเฉิน)
2. **ระบุตำแหน่ง** (ปุ่มดึง GPS พิกัดปัจจุบัน หรือระบุชื่อจุดสังเกต)
3. **รายละเอียดเฉพาะทาง**:
   - **น้ำท่วม**: ระดับน้ำ (<10cm, 10-30cm, 30-50cm, >100cm), รถเล็กผ่านได้ไหม, รถใหญ่ผ่านได้ไหม, มีไฟฟ้ารั่วหรือไม่
   - **รถติด**: ความเร็วเฉลี่ย (km/h), ความยาวท้ายแถว (km), สาเหตุ
4. **แนบรูปภาพ**: รองรับการอัปโหลดหลายภาพ พร้อมพรีวิวและระบบตรวจจับขนาด
5. **ตรวจสอบและเผยแพร่**: มีระบบ Duplicate Detection เตือนหากมีรายงานซ้ำในระยะใกล้เคียง

### 5. 👥 ระบบยืนยันข้อมูลโดยชุมชน (Community Verification & Trust Score)
- ปุ่ม 👍 **"ยังเกิดอยู่"** (Confirm) และ 👎 **"ไม่พบเหตุการณ์ / คลี่คลายแล้ว"** (Dispute)
- สัญลักษณ์รับรองความน่าเชื่อถือ: *"ข้อมูลได้รับการยืนยันจากผู้ใช้งานหลายราย"*
- ไทม์ไลน์บันทึกประวัติการเปลี่ยนแปลงแบบละเอียด (Incident Timeline)

### 6. 📊 ศูนย์วิเคราะห์สถิติสถานการณ์ (Analytics Dashboard `/dashboard`)
- กราฟสรุปจำนวนเหตุการณ์ Active, น้ำท่วม, รถติด, อุบัติเหตุ
- สัดส่วนความรุนแรง (Severity Breakdown: Low, Medium, High, Critical)
- แผนที่ความหนาแน่นจุดเกิดเหตุ (Hotspot Areas)

### 7. 🛡️ ระบบผู้ดูแลและการตรวจสอบความถูกต้อง (Moderation Portal `/admin`)
- ตรวจสอบรายงานทั้งหมด จัดการปิดเคส (Resolve) หรือลบรายงานที่เป็นสแปม
- บันทึกประวัติการดำเนินงานของผู้ดูแล (Audit Logs)

---

## 🏗️ สถาปัตยกรรมระบบ (System Architecture)

```
                       ┌─────────────────────────┐
                       │   Client Web Browser    │
                       │   (Next.js 16 + React)  │
                       └────────────┬────────────┘
                                    │
             ┌──────────────────────┴──────────────────────┐
             │                      │                      │
     HTTP REST API / JSON   Server-Sent Events (SSE)   Client GPS / Map
     (/api/incidents, etc.)   (/api/realtime)          (Leaflet Dark Tiles)
             │                      │                      │
             ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Backend Handlers                     │
│  - Input Validation (Zod)        - Duplicate Detection (350m)   │
│  - Distance Calculations (Haversine) - Event Broadcaster        │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
                   ▼                             ▼
       ┌───────────────────────┐     ┌───────────────────────┐
       │   Prisma ORM (v6.4)   │     │  External Providers   │
       │   PostgreSQL Engine   │     │  (Traffic/Flood/Rail) │
       └───────────┬───────────┘     └───────────────────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │    Neon Cloud DB      │
       │  (PostgreSQL Pooler)  │
       └───────────────────────┘
```

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema)

ระบบเชื่อมต่อกับ **Neon Cloud PostgreSQL** โดยมีตารางข้อมูลหลักดังนี้:

| ตาราง (Table) | หน้าที่และรายละเอียด |
|---|---|
| `users` | ข้อมูลผู้ใช้งาน, ระดับความน่าเชื่อถือ (Reputation), บทบาท (User, Moderator, Admin) |
| `incidents` | รายงานเหตุการณ์, ละติจูด, ลองจิจูด, ประเภท, ระดับความรุนแรง, สถานะ, ผู้รายงาน |
| `incident_images` | รูปภาพประกอบเหตุการณ์, URL, คำอธิบายภาพ |
| `incident_updates` | ประวัติไทม์ไลน์ของแต่ละเหตุการณ์ (สร้าง, มีคนยืนยัน, เพิ่มรูป, คลี่คลาย) |
| `confirmations` | บันทึกการโหวตยืนยัน (👍 ยังเกิดอยู่ / 👎 ไม่พบเหตุการณ์) ป้องกันโหวตซ้ำ |
| `comments` | ความคิดเห็นและการอัปเดตสถานการณ์เพิ่มเติมจากคนในพื้นที่ |
| `transport_lines` | ข้อมูลสายรถไฟฟ้า (BTS, MRT, ARL, SRT), สีประจำสาย, สถานะการเดินรถ |
| `transport_stations` | พิกัดสถานีรถไฟฟ้า และสถานะการเปิดให้บริการ |
| `saved_areas` | พื้นที่ที่ผู้ใช้งานบันทึกไว้สำหรับรับการแจ้งเตือน (Area Watch) |
| `audit_logs` | ประวัติการกระทำของผู้ดูแลระบบ (แบน, ลบ, แก้ไขสถานะ) |

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Getting Started)

### ความต้องการพื้นฐาน (Prerequisites)
- [Node.js](https://nodejs.org/) v18.0.0 ขึ้นไป
- [npm](https://www.npmjs.com/) v9.0.0 ขึ้นไป
- ฐานข้อมูล PostgreSQL (หรือใช้ Neon Cloud PostgreSQL)

### 1. ติดตั้ง Dependencies
```bash
git clone https://github.com/your-username/thai-incident-map.git
cd thai-incident-map
npm install
```

### 2. ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```
กำหนดค่า `DATABASE_URL` ในไฟล์ `.env`:
```env
DATABASE_URL="postgresql://username:password@ep-xxxxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. ซิงค์ตารางฐานข้อมูล (Push Prisma Schema)
คำสั่งนี้จะสร้างตาราง, ฟิลด์, ดัชนี (Indexes) และ Enums ทั้งหมดลงบน Neon PostgreSQL ทันที:
```bash
npx prisma db push
```

### 4. นำเข้าข้อมูลเริ่มต้น (Seed Initial Data)
นำเข้าข้อมูลจุดเกิดเหตุกรุงเทพฯ, รถไฟฟ้า BTS/MRT ทุกสาย, และบัญชีผู้ดูแลระบบ:
```bash
node prisma/seed.mjs
```

### 5. รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Mode)
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่: `http://localhost:3000`

### 6. คอมไพล์และรันแบบ Production
```bash
npm run build
npm run start
```

---

## 📡 รายการ API (API Endpoints Documentation)

### รายงานเหตุการณ์ (Incidents)
- `GET /api/incidents` — ดึงรายการเหตุการณ์ทั้งหมด (รองรับ Query: `?type=FLOOD`, `?severity=CRITICAL`, `?status=ACTIVE`, `?q=อโศก`, `?lat=13.7&lng=100.5&radius=5`)
- `POST /api/incidents` — สร้างรายงานเหตุการณ์ใหม่ (ตรวจสอบข้อมูลด้วย Zod และกระจายสัญญาณ SSE ทันที)
- `GET /api/incidents/:id` — ดึงรายละเอียดเหตุการณ์เดี่ยว พร้อมรูปภาพ ไทม์ไลน์ และความคิดเห็น
- `PATCH /api/incidents/:id` — อัปเดตสถานะเหตุการณ์ (เช่น เปลี่ยนเป็น `RESOLVED`)
- `DELETE /api/incidents/:id` — ลบเหตุการณ์ (สำหรับแอดมิน)
- `POST /api/incidents/:id/confirm` — ยืนยันว่าเหตุการณ์ยังเกิดขึ้นจริง (👍)
- `POST /api/incidents/:id/dispute` — แจ้งว่าไม่พบเหตุการณ์แล้ว (👎)
- `GET /api/incidents/:id/comments` — ดูความคิดเห็นทั้งหมดของเหตุการณ์
- `POST /api/incidents/:id/comments` — เพิ่มความคิดเห็น / อัปเดตข้อมูลจากพื้นที่

### ระบบรถไฟฟ้า & ขนส่งสาธารณะ (Transit)
- `GET /api/transport` — รายการสายรถไฟฟ้า BTS, MRT, ARL, SRT พร้อมสถานะการเดินรถและความล่าช้า

### สถิติภาพรวม (Dashboard)
- `GET /api/dashboard` — ข้อมูลสถิติเชิงปริมาณ จำนวนเหตุการณ์ตามประเภท และระดับความรุนแรง

### ระบบเรียลไทม์ (Real-Time Broadcast)
- `GET /api/realtime` — ช่องทาง Server-Sent Events (SSE) ส่งข้อมูลอัปเดตแบบถ่ายทอดสด

### ระบบผู้ดูแล (Admin)
- `GET /api/admin` — ดึงข้อมูลเหตุการณ์และ Audit Logs สำหรับการตรวจสอบ
- `POST /api/admin` — ดำเนินการทางแอดมิน (Resolve, Delete, Hide)

---

## 🛡️ นโยบายความปลอดภัยและข้อจำกัดความรับผิดชอบ (Safety Disclaimer)

> ⚠️ **ข้อควรระวังสำคัญ:**
> ข้อมูลและรายงานบนแพลตฟอร์มนี้เป็นข้อมูลที่ได้จากการรายงานโดยประชาชนในชุมชน (Crowdsourced Data) ซึ่งอาจมีความคลาดเคลื่อนหรือไม่เป็นปัจจุบัน กรุณาตรวจสอบสถานการณ์กับหน่วยงานราชการหรือแหล่งข่าวทางการเมื่อจำเป็นเร่งด่วน

---

## 📦 การเตรียมพร้อมขึ้น GitHub (Git Workflow)

1. ตรวจสอบไฟล์ `.gitignore` เพื่อมั่นใจว่าจะไม่มีรหัสผ่านหรือไฟล์ `.env` หลุดขึ้น GitHub:
   ```bash
   git status
   ```
2. บันทึกโค้ดเข้า Git:
   ```bash
   git add .
   git commit -m "feat: real-time community map with Neon PostgreSQL, Next.js, and Leaflet"
   ```
3. เชื่อมต่อกับ GitHub Remote Repository ของคุณ:
   ```bash
   git remote add origin https://github.com/your-username/thai-incident-map.git
   git branch -M main
   git push -u origin main
   ```

---

## 📄 ใบอนุญาต (License)

พัฒนาภายใต้ใบอนุญาต [MIT License](LICENSE) สามารถนำไปต่อยอดและพัฒนาเพื่อประโยชน์สาธารณะได้โดยเสรี
