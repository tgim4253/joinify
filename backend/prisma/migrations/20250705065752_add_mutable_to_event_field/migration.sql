-- AlterTable
ALTER TABLE "event_fields" ADD COLUMN     "is_mutable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "use_for_matching" BOOLEAN NOT NULL DEFAULT false;
