-- AlterTable
ALTER TABLE `contents` MODIFY `arabic` VARCHAR(300) NOT NULL,
    MODIFY `latin` VARCHAR(300) NOT NULL,
    MODIFY `translate_id` VARCHAR(300) NOT NULL,
    MODIFY `description` VARCHAR(255) NOT NULL;
