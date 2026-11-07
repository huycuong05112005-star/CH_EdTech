# Backup and Disaster Recovery Strategy

## 1. PostgreSQL & pgvector Backup
- Daily logical backups via `pg_dump`:
  ```bash
  pg_dump -U ch_edtech_admin -d ch_edtech_db -F c -f /backups/ch_edtech_snapshot.dump
  ```
- Retention policy: 30 daily snapshots, 12 monthly snapshots.
- Storage: Offsite Object Storage bucket with immutable object locking.

## 2. Object Storage Data Backup
- Bucket replication between primary storage and backup storage provider.

## 3. Disaster Recovery (RTO / RPO)
- **Target RPO (Recovery Point Objective):** < 1 hour.
- **Target RTO (Recovery Time Objective):** < 2 hours.
