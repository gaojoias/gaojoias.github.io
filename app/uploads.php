<?php

declare(strict_types=1);

// Lives next to public_html (like gaoapp_config.php): Hostinger's git deploy
// deletes every file in public_html that is not in the repository.
function upload_storage_dir(): string
{
    return dirname(__DIR__, 2) . '/gaoapp_uploads';
}
