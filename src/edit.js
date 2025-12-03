(function () {
    const { registerBlockType } = wp.blocks;
    const { RichText, useBlockProps, InspectorControls, MediaUpload } = wp.blockEditor || wp.editor;
    const { PanelBody, Button } = wp.components;
    const el = wp.element.createElement;

    registerBlockType('custom/animated-banner', {
        edit: (props) => {
            const { attributes, setAttributes } = props;
            const { headline, subheadline, backgroundImage } = attributes;

            const blockProps = useBlockProps({
                className: 'animated-banner-block',
                style: backgroundImage
                    ? {
                          backgroundImage: `url(${backgroundImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                      }
                    : {}
            });

            return el(
                'div',
                {},
                // SIDOPANEL
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        { title: 'Background Image', initialOpen: true },
                        el(MediaUpload, {
                            onSelect: (media) => setAttributes({ backgroundImage: media.url }),
                            type: 'image',
                            value: backgroundImage,
                            render: ({ open }) =>
                                el(
                                    Button,
                                    {
                                        onClick: open,
                                        isPrimary: true
                                    },
                                    backgroundImage ? 'Replace image' : 'Select image'
                                )
                        }),
                        backgroundImage &&
                            el(
                                Button,
                                {
                                    onClick: () => setAttributes({ backgroundImage: '' }),
                                    isDestructive: true,
                                    style: { marginTop: '10px' }
                                },
                                'Remove image'
                            )
                    )
                ),

                // BLOCK CONTENT
                el(
                    'div',
                    blockProps,
                    el(RichText, {
                        tagName: 'h2',
                        value: headline,
                        onChange: (value) => setAttributes({ headline: value }),
                        placeholder: 'Headline...'
                    }),
                    el(RichText, {
                        tagName: 'p',
                        value: subheadline,
                        onChange: (value) => setAttributes({ subheadline: value }),
                        placeholder: 'Subheadline...'
                    })
                )
            );
        },

        save: () => null
    });
})();
