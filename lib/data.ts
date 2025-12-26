export interface TimelineItem {
  month: string;
  event: string;
  detail: string;
  type: 'success' | 'tech' | 'event' | 'milestone' | 'team';
  tags?: string[];
  jobs?: string[];
}

export const timeline2024: TimelineItem[] = [
  { month: "ม.ค. - มี.ค.", event: "จุดเริ่มต้น HOBOT", detail: "วางแผนและเตรียมการเบื้องต้นเพื่อก่อตั้งทีม", type: "milestone", jobs: ["Project Initiation"] },
  { month: "เม.ย.", event: "เริ่มฟอร์มทีมงาน", detail: "เริ่มทีมงานหลัก (Include - เบส)", type: "team", jobs: ["Team Building"] },
  { month: "พ.ค.", event: "งาน Kingdom", detail: "ออกงาน Robotarm + พัฒนา LinearTrack v1", type: "event", tags: ["Robotarm", "LinearTrack v1"], jobs: ["งาน Kingdom"] },
  { month: "มิ.ย.", event: "งาน Mis", detail: "ขยายพื้นที่โกดังบางบัวทอง และเช่า AGV ออกงาน", type: "event", tags: ["AGV"], jobs: ["งาน Mis (AGV)"] },
  { month: "ก.ค.", event: "R&D Turntable ครั้งแรก", detail: "พัฒนา LinearTrack v2 และไปดูงานที่จีน", type: "tech", jobs: ["R&D Linear v2"] },
  { month: "ส.ค. - ก.ย.", event: "งาน นน & งานบ้าน PP", detail: "เริ่มนำ Turntable ออกงานครั้งแรกๆ", type: "event", tags: ["Turntable"], jobs: ["งาน นน", "งานบ้าน PP"] },
  { month: "พ.ย.", event: "RoboDK Realtime", detail: "เริ่มใช้ระบบ Realtime Robotarm และรางแบบกระโถง", type: "tech", jobs: ["RoboDK Setup"] },
  { month: "ธ.ค.", event: "งาน Whiteparty", detail: "Robotarm ออกงานใหญ่ส่งท้ายปี", type: "event", tags: ["Robotarm"], jobs: ["งาน Whiteparty"] },
];

export const timeline2025: TimelineItem[] = [
  { month: "ม.ค.", event: "งาน Samsung", detail: "R&D Robot/Display (มีบทเรียน Robot ตก)", type: "event", tags: ["Robotarm", "Display"], jobs: ["งาน Samsung"] },
  { month: "ก.พ.", event: "ย้ายโกดังแจ้งวัฒนะ", detail: "สร้าง treadmill (Pulse Control)", type: "milestone", jobs: ["Warehouse Moving"] },
  { month: "มี.ค.", event: "งาน PP", detail: "ออกงานลู่วิ่ง", type: "event", tags: ["treadmill"], jobs: ["งาน PP (ลู่วิ่ง)"] },
  { month: "เม.ย.", event: "งาน Ten101 & EtherCAT", detail: "เริ่มใช้ระบบ EtherCAT และนำเข้า Gear 30:1", type: "tech", tags: ["treadmill"], jobs: ["งาน Ten101"] },
  { month: "พ.ค.", event: "งาน Jeff", detail: "ใช้ Turn ใหญ่-เล็ก, สร้างรางเคลื่อนที่เล็ก, ทำตู้ Control", type: "event", tags: ["Turntable", "EtherCAT"], jobs: ["งาน Jeff (Turn ใหญ่/เล็ก)"] },
  { month: "มิ.ย.", event: "งาน MUT", detail: "สร้างล้อ Combide ครั้งแรก และ Robotarm ออกงาน", type: "event", tags: ["Robotarm", "ล้อ Combide"], jobs: ["งาน MUT"] },
  { month: "ก.ค.", event: "Robot Sync Success", detail: "สร้างมอเตอร์ไซค์ HOBOT และ Sync จอได้สำเร็จครั้งแรก", type: "success", tags: ["Robot Sync", "Display"], jobs: ["HOBOT Motorcycle"] },
  { month: "ส.ค.", event: "งาน Nimitr & Asia7", detail: "สร้างจอแท่ง และเครื่องดูดผ้าครั้งแรก", type: "success", tags: ["Turntable", "เครื่องดูดผ้า", "จอแท่ง"], jobs: ["งาน Nimitr", "งาน Asia7"] },
  { month: "ก.ย.", event: "งาน Nont & งาน Mirr", detail: "เครื่องดูดผ้า และ Stage Mobile + Turn ออกงาน", type: "event", tags: ["เครื่องดูดผ้า", "Stage Mobile", "Turntable"], jobs: ["งาน Nont", "งาน Mirr"] },
  { month: "ต.ค.", event: "Peak Workload", detail: "เดือนที่งานหนาแน่นที่สุดของปี", type: "event", tags: ["เครื่องดูดผ้า (3)", "Turntable", "Robotarm", "treadmill"], jobs: ["งาน Pun", "งาน ขีดลม", "งาน Tatto Color", "งาน Da", "งาน Dark"] },
  { month: "พ.ย.", event: "งาน HILUX & งาน BUS", detail: "งานเครื่องดูดผ้า และงาน BUS (บันทึกว่าไม่สำเร็จ)", type: "event", tags: ["เครื่องดูดผ้า", "Stage Mobile (Failed)"], jobs: ["งาน HILUX", "งาน BUS (Failed)"] },
  { month: "ธ.ค.", event: "สร้างรางจอครั้งแรก", detail: "พัฒนา Product รางจอเพื่อขยายศักยภาพปีหน้า", type: "tech", tags: ["รางจอ"], jobs: ["R&D รางจอ"] },
];

export const productStats = [
  { name: "Turntable", count: 6, color: "bg-blue-500" },
  { name: "เครื่องดูดผ้า", count: 5, color: "bg-purple-500" },
  { name: "RobotArm", count: 3, color: "bg-indigo-500" },
  { name: "LinearTrack", count: 3, color: "bg-cyan-500" },
  { name: "treadmill", count: 3, color: "bg-emerald-500" },
  { name: "ล้อ Combide", count: 2, color: "bg-orange-500" },
  { name: "Stage Mobile", count: 2, color: "bg-red-500" },
  { name: "รางจอ", count: 2, color: "bg-slate-500" },
  { name: "จอแท่ง", count: 1, color: "bg-gray-400" },
];

