<?php

$headline = $attributes['headline'] ?? '';
$sub = $attributes['subheadline'] ?? '';
$bg = $attributes['backgroundImage'] ?? '';

$style = $bg ? 'style="background-image:url(' . esc_url($bg) . '); background-size:cover; background-position:center;"' : '';

?>
<div class="animated-banner-block" <?php echo $style; ?>>
    <div class="animated-banner-content">
        <h2><?php echo esc_html($headline); ?></h2>
        <p><?php echo esc_html($sub); ?></p>
    </div>
</div>
