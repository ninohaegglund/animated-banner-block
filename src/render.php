<?php
/**
 * Server-rendered block view.
 *
 * Attributes: headline, subheadline, backgroundImage, animateOnce, showMarquee, marqueeSpeed, marqueeDirection, metrics[]
 */

$headline        = isset($attributes['headline']) ? $attributes['headline'] : 'HF Agency i siffror';
$subheadline     = isset($attributes['subheadline']) ? $attributes['subheadline'] : 'Vår sammanfattning av nyckeltal';
$background      = isset($attributes['backgroundImage']) ? $attributes['backgroundImage'] : '';
$animate_once    = !empty($attributes['animateOnce']);
$show_marquee    = !empty($attributes['showMarquee']);
$marquee_speed   = isset($attributes['marqueeSpeed']) ? floatval($attributes['marqueeSpeed']) : 20;
$marquee_dir     = (isset($attributes['marqueeDirection']) && $attributes['marqueeDirection'] === 'right') ? 'right' : 'left';
$metrics         = isset($attributes['metrics']) && is_array($attributes['metrics']) ? $attributes['metrics'] : [];

$style_attr = $background ? ' style="background-image:url(' . esc_url($background) . '); background-size:cover; background-position:center;"' : '';

?>
<div class="animated-banner-block" data-animate-once="<?php echo esc_attr( $animate_once ? 'true' : 'false' ); ?>"<?php echo $style_attr; ?>>
  <div class="animated-banner-content">
    <?php if ( ! empty( $headline ) ) : ?>
      <h2><?php echo esc_html( $headline ); ?></h2>
    <?php endif; ?>

    <?php if ( ! empty( $subheadline ) ) : ?>
      <p><?php echo esc_html( $subheadline ); ?></p>
    <?php endif; ?>

    <?php if ( $show_marquee ) : ?>
        <div class="abb-viewport" aria-hidden="true">
      <div class="abb-track" data-speed="<?php echo esc_attr( $marquee_speed ); ?>" data-direction="<?php echo esc_attr( $marquee_dir ); ?>">
        <span class="abb-item">HSB</span>
        <span class="abb-item">Rikshem</span>
        <span class="abb-item">Wallenstam</span>
        <span class="abb-item">Vasakronan</span>
        <span class="abb-item">Balder</span>
        <span class="abb-item">Kopparstaden</span>
        <span class="abb-item">Stockholmshem</span>
        <span class="abb-item">Bostadsbolaget</span>
        <span class="abb-item">MKB Fastighets AB</span>
        <span class="abb-item">Familjebostäder</span>
        <span class="abb-item">HSB</span>
        <span class="abb-item">Rikshem</span>
        <span class="abb-item">Wallenstam</span>
        <span class="abb-item">Vasakronan</span>
        <span class="abb-item">Balder</span>
        <span class="abb-item">Kopparstaden</span>
        <span class="abb-item">Stockholmshem</span>
        <span class="abb-item">Bostadsbolaget</span>
        <span class="abb-item">MKB Fastighets AB</span>
        <span class="abb-item">Familjebostäder</span>
      
      </div>
    </div>
    <?php endif; ?>

    <?php if ( ! empty( $metrics ) ) : ?>
      <div class="ab-metrics" role="group" aria-label="<?php echo esc_attr( $headline ?: 'Nyckeltal' ); ?>">
        <?php foreach ( $metrics as $m ) :
          $icon     = isset( $m['icon'] ) ? $m['icon'] : '';
          $label    = isset( $m['label'] ) ? $m['label'] : '';
          $number   = isset( $m['number'] ) ? floatval( $m['number'] ) : 0;
          $suffix   = isset( $m['suffix'] ) ? $m['suffix'] : '';
          $sub      = isset( $m['sub'] ) ? $m['sub'] : '';
          $decimals = isset( $m['decimals'] ) ? intval( $m['decimals'] ) : 0;
        ?>
          <div class="ab-metric">
            <?php if ( $icon ) : ?>
              <div class="ab-icon" aria-hidden="true"><?php echo esc_html( $icon ); ?></div>
            <?php endif; ?>

            <?php if ( $label ) : ?>
              <p class="ab-label"><?php echo esc_html( $label ); ?></p>
            <?php endif; ?>

            <p class="ab-number">
              <span
                data-count-to="<?php echo esc_attr( $number ); ?>"
                data-decimals="<?php echo esc_attr( $decimals ); ?>"
                data-suffix="<?php echo esc_attr( $suffix ); ?>"
              >0</span>
              <?php
              ?>
            </p>

            <?php if ( $sub ) : ?>
              <p class="ab-sub"><?php echo esc_html( $sub ); ?></p>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</div>