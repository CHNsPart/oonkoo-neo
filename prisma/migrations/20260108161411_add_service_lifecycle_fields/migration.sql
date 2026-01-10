-- AlterTable
ALTER TABLE "services" ADD COLUMN     "activated_at" TIMESTAMP(3),
ADD COLUMN     "admin_notes" TEXT,
ADD COLUMN     "external_links" JSONB DEFAULT '[]',
ADD COLUMN     "payment_received_at" TIMESTAMP(3),
ADD COLUMN     "user_notes" TEXT;

-- CreateIndex
CREATE INDEX "services_status_idx" ON "services"("status");
