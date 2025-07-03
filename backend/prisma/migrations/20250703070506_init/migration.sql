-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'viewer');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(255),
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "contact_name" VARCHAR(100),
    "contact_phone" VARCHAR(50),
    "banner_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_fields" (
    "id" BIGSERIAL NOT NULL,
    "eventId" BIGINT NOT NULL,
    "fieldKey" VARCHAR(100) NOT NULL,
    "displayName" VARCHAR(100) NOT NULL,
    "dataType" VARCHAR(20) NOT NULL,
    "is_sensitive" BOOLEAN NOT NULL DEFAULT false,
    "mask_from" INTEGER,
    "mask_to" INTEGER,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "enum_options" JSONB,
    "default_value" TEXT,

    CONSTRAINT "event_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" BIGSERIAL NOT NULL,
    "eventId" BIGINT NOT NULL,
    "data" JSONB NOT NULL,
    "slack_user_id" VARCHAR(50),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_fields_eventId_fieldKey_key" ON "event_fields"("eventId", "fieldKey");

-- CreateIndex
CREATE INDEX "members_eventId_idx" ON "members"("eventId");

-- AddForeignKey
ALTER TABLE "event_fields" ADD CONSTRAINT "event_fields_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
