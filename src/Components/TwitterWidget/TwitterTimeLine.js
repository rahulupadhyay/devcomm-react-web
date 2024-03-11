import React, { useRef } from 'react';
import { useEffect } from 'react';
import twitter_widget_js from './twitter-widget-url';


const TwitterTimeLine = (props) => {
    const embedContainer = useRef();
    useEffect(() => {
        let script = require('scriptjs');
        script(twitter_widget_js, 'twitter-embed', () => {
            if (!window.twttr) {
                // console.error('Failure to load window.twttr in TwitterTimelineEmbed, aborting load.')
                return
            }

            let options = buildOptions()
            /** Append chrome options */
            options = buildChromeOptions(options)
            renderWidget(options);
        })
    }, [])

    const buildChromeOptions = (options) => {
        options.chrome = ''
        if (props.noHeader) { options.chrome = options.chrome + ' noheader' }

        if (props.noFooter) { options.chrome = options.chrome + ' nofooter' }

        if (props.noBorders) { options.chrome = options.chrome + ' noborders' }

        if (props.noScrollbar) { options.chrome = options.chrome + ' noscrollbar' }

        if (props.transparent) { options.chrome = options.chrome + ' transparent' }

        return options
    }

    const buildOptions = () => {
        let options = Object.assign({}, props.options)
        if (props.autoHeight) { options.height = embedContainer.parentNode.offsetHeight }

        options = Object.assign({}, options, {
            theme: props.theme,
            linkColor: props.linkColor,
            borderColor: props.borderColor,
            lang: props.lang,
        })

        return options
    }
    const renderWidget = (options) => {
        // console.debug('Options', options);
        window.twttr.widgets.createTimeline(
            {
                sourceType: props.sourceType,
                screenName: props.screenName,
                //userId: this.props.userId,
                //ownerScreenName: this.props.ownerScreenName,
                //slug: this.props.slug,
                //id: this.props.id || this.props.widgetId,
                //url: this.props.url,
                // dataTweetLimit: '1',
            },
            embedContainer.current,
            options
        )
    }


    return <div ref={embedContainer} />
}

export default TwitterTimeLine;