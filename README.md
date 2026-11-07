# CH EdTech

> **Tagline:** See Mathematics. Understand Geometry. Learn Smarter.  
> **Ngôn ngữ:** Tiếng Việt (Chính) & English (Secondary)  
> **Môi trường vận hành:** Windows 11 Dev Environment / Docker Desktop / Cloudflare

---

## 1. Giới Thiệu CH EdTech
**CH EdTech** là nền tảng công nghệ giáo dục chuyên sâu về trực quan hóa toán học và hình học không gian 2D/3D. Hệ thống giúp học sinh thấu hiểu bản chất không gian thông qua các mô hình tương tác thời gian thực, đồng thời hỗ trợ giáo viên biên soạn bài giảng trực quan và ứng dụng AI Agent để giải toán có kiểm chứng.

## 2. Tầm Nhìn Sản Phẩm
Biến các định lý toán học trừu tượng thành trải nghiệm trực quan sống động mà học sinh có thể quan sát, xoay chuyển và tính toán chính xác. Động cơ hình học tính toán độc lập đảm bảo mọi quan hệ toán học được chứng minh bằng đại số tuyến tính, không suy đoán cảm tính từ hình ảnh.

## 3. Mục Tiêu và Phạm Vi
- **Đối tượng:** Học sinh THPT, Giáo viên Toán học, Quản trị viên nhà trường.
- **Phạm vi ban đầu:** Hình học phẳng 2D, Hình học không gian 3D (Khối đa diện, Khối tròn xoay, Góc, Khoảng cách, Thể tích, Mặt cắt).
- **Phạm vi mở rộng:** Tích hợp AI Agent sư phạm, RAG tài liệu tri thức giáo khoa với pgvector, kiểm tra và phê duyệt đề thi trực tuyến.

## 4. Tính Năng Chính
1. **Xưởng Hình Học Không Gian 3D:** Xoay 360°, phóng to/thu nhỏ, xem khung dây, điều chỉnh độ trong suốt, đo khoảng cách, tính thể tích và diện tích tức thời.
2. **AI Trợ Lý Toán Học:** Nhận diện đề bài văn bản/hình ảnh, lập kế hoạch dựng hình, gọi Geometry Tools và kiểm chứng kết quả.
3. **Phân Hệ 3 Cổng Độc Lập:**
   - **Admin Portal:** Quản trị người dùng, khóa học, phê duyệt đề thi, giám sát hạ tầng.
   - **Teacher Portal:** Dựng bài giảng 3D, tạo bài tập, gửi đề thi để Admin duyệt.
   - **Student Portal:** Xem bài giảng 3D tương tác, làm bài kiểm tra, hỏi trợ lý AI.
4. **Hệ Thống Lưu Trữ Object Storage:** Không lưu file trên ổ cứng ứng dụng; lưu trữ độc lập trên MinIO/Cloudflare R2 với Pre-signed URLs.
5. **Hệ Thống Giám Sát & Telemetry:** Prometheus thu thập chỉ số, Grafana hiển thị dashboard, Loki tập trung log.

## 5. Kiến Trúc Tổng Thể
```text
                      INTERNET
                          |
                          v
                   CLOUDFLARE WAF
                          |
              +-----------+-----------+
              |                       |
              v                       v
     Frontend (Vite / React)    API (Spring Boot 3.4)
     Port 5175                  Port 8085
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
  PostgreSQL 16                 Object Storage                 Prometheus & Grafana
  pgvector 0.8.7 (Port 5434)    MinIO (Port 9000/9001)         Ports 9090 / 3000
```

## 6. Công Nghệ Sử Dụng
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Three.js, Zustand, i18next.
- **Backend:** Java 25 LTS (Release target 21), Spring Boot 3.4+, Spring Security, Spring Data JPA, Hibernate, Flyway, S3 AWS SDK v2, Actuator, Springdoc OpenAPI.
- **Database & AI:** PostgreSQL 16, pgvector 0.8.7, HNSW Cosine Index.
- **Storage:** MinIO (Local Development) / Cloudflare R2 (Production S3).
- **Observability:** Prometheus v2.53, Grafana v11.0, Loki v3.0, Micrometer.

## 7. Sơ Đồ Cấu Trúc Dự Án
```text
CH-EdTech/
├── AGENTS.md                  # Quy tắc phát triển & tiêu chuẩn bảo mật vibe-check
├── README.md                  # Tài liệu trung tâm 30 mục
├── .env.example               # Mẫu biến môi trường
├── docker-compose.yml         # Hạ tầng container (Postgres, MinIO, Prometheus, Grafana, Loki)
├── .agents/skills/            # 20 skills nghiệp vụ + vibe-check security audit
├── apps/
│   ├── web/                   # Ứng dụng Frontend React + Vite + Three.js
│   └── api/                   # Backend Modular Monolith Spring Boot 3.4+
├── packages/
│   └── geometry-core/         # Thư viện toán hình học tính toán độc lập
├── infrastructure/            # Cấu hình Postgres, MinIO, Prometheus, Grafana, Loki
└── docs/                      # 25+ tài liệu kỹ thuật & ADRs (docs/adr/)
```

## 8. Hướng Dẫn Cài Đặt
```powershell
# 1. Clone hoặc mở thư mục dự án
cd E:\CA_NHAN_CV\CH_EdTech

# 2. Tạo file cấu hình môi trường
Copy-Item .env.example .env

# 3. Khởi động toàn bộ hạ tầng container
docker compose up -d
```

## 9. Hướng Dẫn Chạy Frontend
```powershell
cd apps\web
npm install
npm run dev
# Mở trình duyệt: http://localhost:5175
```

## 10. Hướng Dẫn Chạy Backend
```powershell
# Từ thư mục gốc sử dụng Maven Wrapper
.\mvnw.cmd spring-boot:run -f apps/api/pom.xml
# Backend chạy tại: http://localhost:8085
```

## 11. Hướng Dẫn Chạy Database
Database chạy trong container `ch_edtech_postgres` trên cổng **5434** (tránh xung đột với cổng 5432):
```powershell
# Kết nối psql vào container
docker exec -it ch_edtech_postgres psql -U ch_edtech_admin -d ch_edtech_db
```

## 12. Hướng Dẫn Chạy Docker
```powershell
# Khởi động dịch vụ
docker compose up -d

# Xem trạng thái
docker compose ps

# Dừng dịch vụ
docker compose down
```

## 13. Cấu Hình Môi Trường
Các biến quan trọng trong `.env`:
- `POSTGRES_PORT=5434`
- `SERVER_PORT=8085`
- `FRONTEND_PORT=5175`
- `STORAGE_PROVIDER=minio`
- `STORAGE_ENDPOINT=http://localhost:9000`
- `JWT_SECRET=...`

## 14. Cấu Hình Object Storage
- File người dùng tuyệt đối không lưu trên ổ cứng local của ứng dụng.
- Lưu trên MinIO bucket `ch-edtech-documents` (private) và `ch-edtech-public`.
- Console quản trị MinIO: `http://localhost:9001` (User: `minio_dev_admin`).

## 15. Cấu Hình Vector Search
- Sử dụng `pgvector` v0.8.7 với cột `vector(1536)` cho text-embedding-3-small.
- Đánh chỉ mục HNSW (`m = 16, ef_construction = 64`) để truy xuất ngữ nghĩa siêu tốc.

## 16. Cấu Hình Cloudflare
- Tham khảo chi tiết tại [`docs/CLOUDFLARE_CONFIGURATION.md`](docs/CLOUDFLARE_CONFIGURATION.md).
- Cấu hình SSL/TLS Full (Strict), WAF Custom Rules chặn bot và Rate Limiting trên `/api/auth/*`.

## 17. Cấu Hình Monitoring
- **Prometheus:** `http://localhost:9090` (tự động cào metrics từ `/actuator/prometheus`).
- **Grafana:** `http://localhost:3000` (User: `admin` / Password: `admin_dev_password_2026`).
- **Loki:** `http://localhost:3100` (thu thập structured log).

## 18. Tài Liệu API
- **OpenAPI / Swagger UI:** `http://localhost:8085/swagger-ui.html`
- **Tài liệu đặc tả:** [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)
- **Health Check:** `http://localhost:8085/api/health`

## 19. Hướng Dẫn Kiểm Thử
```powershell
# Kiểm thử Geometry Core
node --test packages/geometry-core/tests/geometry.test.mjs

# Kiểm thử Backend Spring Boot & Flyway
.\mvnw.cmd test -f apps/api/pom.xml

# Kiểm thử build Frontend
npm run build --prefix apps/web
```

## 20. Hướng Dẫn Triển Khai
Xem chi tiết tại [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## 21. Bảo Mật
Tuân thủ toàn diện các quy tắc vibe-check:
- Không đưa secret vào source code hoặc git.
- IDOR check bắt buộc trên mọi thao tác dữ liệu.
- Header bảo mật: HSTS, CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff.
- Chi tiết: [`docs/SECURITY.md`](docs/SECURITY.md).

## 22. Backup và Recovery
- Snapshot cơ sở dữ liệu hàng ngày qua `pg_dump`.
- Chi tiết: [`docs/BACKUP_AND_RECOVERY.md`](docs/BACKUP_AND_RECOVERY.md).

## 23. Roadmap
- **Phase 0:** Nền tảng hạ tầng & Monorepo (Hoàn thành).
- **Phase 1:** Core Platform & Quản lý đào tạo.
- **Phase 2:** Geometry Engine hoàn chỉnh.
- **Phase 3:** AI Agent & RAG.
- **Phase 4:** Hệ thống học tập & thi trực tuyến.
- **Phase 5:** Tối ưu hóa & Hardening bảo mật.
- **Phase 6:** Triển khai Production.

## 24. Trạng Thái Dự Án
Xem tại [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

## 25. Quy Trình Đóng Góp và Phát Triển
1. Tạo branch theo chuẩn: `feat/ten-tinh-nang` hoặc `fix/ten-loi`.
2. Kiểm tra format, unit test và bảo mật trước khi commit.
3. Không bypass các quy định trong `AGENTS.md`.

## 26. Các Quyết Định Kiến Trúc Quan Trọng (ADR)
- [ADR-0001: Modular Monolith Architecture First](docs/adr/ADR-0001-modular-monolith-architecture.md)
- [ADR-0002: PostgreSQL + pgvector for Vector Search](docs/adr/ADR-0002-pgvector-for-vector-embeddings.md)
- [ADR-0003: Storage Abstraction Layer & Pre-signed URLs](docs/adr/ADR-0003-storage-abstraction-and-presigned-urls.md)
- [ADR-0004: Decoupling Geometry Engine from Rendering](docs/adr/ADR-0004-computational-geometry-engine-decoupling.md)
- [ADR-0005: Observability with Prometheus, Grafana, Loki](docs/adr/ADR-0005-observability-with-prometheus-grafana-loki.md)
- [ADR-0006: Port Allocation and Host Collision Avoidance](docs/adr/ADR-0006-port-allocation-and-conflict-prevention.md)

## 27. Các Vấn Đề Đã Biết
- Cổng 5432, 8080 và 5173 trên máy host đang được các ứng dụng khác sử dụng; CH EdTech được cấu hình chạy trên cổng 5434, 8085 và 5175 để tránh xung đột.

## 28. Hướng Dẫn Xử Lý Sự Cố
- Nếu Docker container không khởi động, kiểm tra logs: `docker logs <container_name>`.
- Nếu backend không kết nối được Postgres, kiểm tra biến `SPRING_DATASOURCE_URL` trong `.env`.

## 29. Thông Tin Phiên Bản
- **Phiên bản hiện tại:** 0.1.0-alpha (Foundation Phase)
- **Engine version:** `@ch-edtech/geometry-core v0.1.0`

## 30. Nhật Ký Cập Nhật
- **2026-11-07:** Khởi tạo dự án, thiết lập Monorepo, cấu hình hạ tầng Docker, tích hợp pgvector, MinIO, Prometheus, Grafana, Loki, triển khai Spring Boot và React Vite Three.js.

