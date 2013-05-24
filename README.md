# cartonFactory
This factory method has been build to support developers with a default api to add, change or remove
[cssCarton](http://css.carton.io/) based styling to an DOM-node managed by pure JavaScript.

## Parseing

    <head>
      <script src="cartonFactory.js"></script>
      <style></style>
    </head>

    <body>
      <div id="cartonify">Foo</div>
    </body>
  
    <script>
      var F = cartonFactory( { styleTag: document.getElementsByTagName( 'style' )[ 0 ] })
      
      F.add(
        document.getElementById( 'cartonify' ),
        { type: 'stretch', styles: { background: 'yellow', color: 'orange' }, align: 'center' }
      )
    </script>

In the example the factory will build three CSS-classes with the id **#cartonify** as selector:

    // CSS-code

    #cartonify {display:block;font-size:medium;position:relative;vertical-align:top}
    #cartonify {background:yellow;color:orange }
    #cartonify {text-align:center}

In the first line you can find styles that are necessary to define #cartonify as the cssCarton-type stretch_.
The second line defines the individually styles defined in the styles-key inside of the settings-object
and in the last line another cssCarton-type is defined by the align-key: alignCenter_.
It seams that the factory has parsed the CSS-code in the same order, they are defined inside the passed settings-object, 
but this is not the full truth. Adding another DOM-node with the same properties will show the truth behaviour:

    <body>
      <div id="cartonify">Foo</div>
      <div>Baa</div>
    </body>

    <script>
      var F = cartonFactory({ styleTag: document.getElementsByTagName( 'style' )[ 0 ] })

      F.add(
        document.getElementById( 'cartonify' ),
        { type: 'stretch', styles: { background: 'yellow', color: 'orange' }, align: 'center' }
      )

      F.add( 
        document.getElementsByTagName( 'div' )[ 1 ],
        { align: 'center', type: 'stretch', styles: { background: 'yellow', color: 'orange' } }
      )
    </script>

Aside from the order the second DOM-node has exactly the same settings. The factory will 
ignore the order from the second element.
    
    #cartonify,#carton_1_{display:block;font-size:medium;position:relative;vertical-align:top}
    #cartonify,#carton_1_{background:yellow;color:orange}
    #cartonify,#carton_1_{text-align:center}

This is because the factory combines ( for code reduce ) all DOM-nodes with the same settings to one
CSS-class. In the second example you can also see, that if no id-attribute is set, the factory will 
create its own which will also be added to the attributes of the DOM-node. Instead of id's factory can
also use classes to bind its styles to the DOM. To order the factory to do so, you have to define a 
different selector on the initial function call:

    ...
    var F = cartonFactory({ styleTag: document.getElementsByTagName( 'style' )[ 0 ], selector: '.' })
    ...

    .stretch_{display:block;font-size:medium;position:relative;vertical-align:top}
    .carton_1_,.carton_2_{background:yellow;color:orange}
    .alignCenter_{text-align:center}

The syntax is now friendlier to read, and a little bit shorter. All classnames will be generated
by the factory and attached to the styles attribute and the DOM-node.

## Setting up a Factory
Settings where defined in the initial function call of the factory:

    var F = cartonFactory({ 
      selector: '.',
      styleTag: document.getElementsByTagName( 'style' )[ 0 ],
      showGrid: true
    })

This is a list of all initial settings that are a viable:

  * **styleTag:**
    A HTML style-tag to be filled by the factory with the parsed CSS-code.
    If no style-tag will be passed to the factory, it will create it's own which can be appended to the DOM any time.

  * **selector:** ( '.' , '#' )
    As mentioned before this defines if the factory will use CSS-classes or ids to bind styling to the DOM-nodes.
    Default behavior is to use ids ( # ).

  * **showGrid:** ( true, false ) 
    Outlines all DOM-nodes based on a cssCarton-type. Default setting is false.

  * **extend:**
    Let you extend the cartonObject ( see cartonObject below ) inside of the factory source.
    For example, if you want to extend the default styles of the cssCarton-type slim_ with 
    a font-color you can do this:

        cartonFactory( { extend: { SLIM: { color: 'pink' } } )

  * **once:**
    This is a tiny event, that is fired only once, when styling for an DOM-node is attached to the factory 
    for the very first time:

        cartonFactory( { once: function ( factoryObject, eventname ) { ... } )

  * **on:** 
    Another event that can be defined to trigger every time a styling for an DOM-node has changed or when 
    it was created inside the factory for the first time:
        
        cartonFactory( { on: function ( factoryObject, eventname ) { ... } ) 

## Add command 
If the factory is applied, you can use the add-command to define the styling of an DOM-node and
bind it with the factory to it:

    F.add( document.getElementById( 'cartonify' ), { styles: color: 'pink } )

The first argument must be a DOM-node the factory should manage. Followed by a settings-object,
that defines how to setup the styling of the node. You can add more than one settings-object, as long
as they have the same combination of properties ( align, query, pseudo, type, show ) they will be mixed
together else the factory will create for each combination another CSS-class instance.

## Properties for the settings-object

  *  **styles:** 
     This is the object that passes all the custom CSS-styling inside the factory. You can use
     camelCase to define CSS-styles that are stitched together with a hyphen. If the value is a pure
     number 'px' and also browser specific prefixes like -webkit-
     will be added by the factory:

        F.add(
          document.getElementById( 'cartonify' ),
          { styles: { color: 'pink', zIndex: '12', 'font-size': 12 } }
        )

  * **type:**
    Defines the cssCarton-type the factory should use.

        F.add(
          document.getElementById( 'cartonify' ), 
          { type: 'fit' }
        )

  * **align:** ( left, center, right ) 
    Adds the alignment-types from cssCarton to the DOM-node.
        
        F.add(
          document.getElementById( 'cartonify' ),
          { align: left }
        )

  * **show:** ( true, false )
    Different than the global showGrid setting this outlines each DOM-node based on cssCarton
    individualy if it is set on true.

        F.add(
          document.getElementById( 'cartonify' ),
          { show: true }
        )

  * **pseudo:**
    The factory can also handle CSS-pseudo-classes and inheritance by defining the pseudo-property:

        F.add(
          document.getElementById( 'cartonify' ),
          { styles: { color: 'pink', zIndex: '12', 'font-size': 12 } },
          { styles: { color: 'orange' }, pseudo: ':hover' },
          { styles: { fontWeight: 'strong' }, pseudo: 'strong' }
        )

    If a pseudo-property is set the styles of a settings-object will only appear in it's
    context. For the sample above, that means the font-color will only be orange on a mouse over. And
    the font-weight will only be strong for child-nodes inside the DOM-node with the nodeName
    strong.

  * **query:**
    With the query-property you can define styles that only appear if the conditions of an 
    media-query matches. To define a media-query you have to add the query properties as an
    object:

        F.add( 
           document.getElementById( 'cartonify' ), 
           { type: 'sticker', { fontSize: 32, top: 15, left: 15 } }
           ,
           { type: 'sticker',
             query: { screen: 'all', maxWidth: '320px' } ,
             styles: { fontSize: 16, top: 5, left: 5 } 
           }
        ) 

    In the example above the top, left and font-size will be smaller if the browser window width is
    lower than 320px. If an query-property is defined all styles of it's parent 
    settings-object will be parsed as CSS-code inside of the media-query.

## cartons
The factory can provide more than one set sytle-settings for a single DOM-node to manage the different
styleings that occur in combination of media-queries, pseudo-classes and inheritance. In the factory these 
settings are named cartons.

## The rest of the commands

* **parse:** 
  `F.parse()` 
  Will trigger the parse-process inside of the factory; Update the provided style-tag
  and return an object with in it and the parsed CSS-code as a string. `{ tag: ..., css: ... }'.
  If no style-tag was passed in the initial settings the factory will build one and return that,
  without attaching it to the DOM. You can also pass a style-tag to the parse command to fill 
  with the pased CSS-code:

        F.parse( document.getElementsByTagName( 'style' )[ 0 ] )

* **get:** 
  Use `F.get()` to search inside the factory for cartons that have specific
  properties:

        F.get( { styles: { color: 'pink' } } )

  This will return an array of all cartons that have a pink font-color. You can also 
  define color with the boolean true to get cartons with a color, no matter which value they
  have:

        F.get( { styles: { color: true } } )

  Or you define color as false to get all cartons without a color inside the styles
  property. You can also search for cartons that belongs to specific DOM-nodes:

        F.get( { dom: document.getElementById( 'cartonify' ), styles: { color: true } } )

  If you wanna look for an property that is not an object and you are searching for more than one
  value do this:

        F.get( { type: [ 'slim', 'stretch' ] } )

  This will return all cartons that are the type slim_ or stretch_. You can combine as many
  factory properties as you want to improve your results. It is also important to know that CSS-styles
  that are part of an cssCarton-type will never match.

* **set:**
  You can also add or override properties of existing cartons:

        F.set( { styles: { color: pink } }, { styles: { color: 'green' } } )

  In the first object the search criteria will be defined like in the get command. In the second
  you can add new properties or overwrite an existing. After that the factory will return a list of all
  changed cartons as an array and the updated CSS-code as an string. `{ cartons: ..., parsed: ... }`
  
* **remove:**
  To remove a carton you can use remove:

        F.remove( { styles: {  color: pink } } )

  The removed cartons and the updated CSS-code will be returned inside of an object. `{ cartons: ..., parsed: ... }`

* **index:** 
  You can get two different lists from that command:
        
        F.index( 'dom' )
  
  By passing 'dom' as the first argument all DOM-nodes managed by the factory will be returned
  as an array.
       
        F.index( 'factories' )
  
  If instead of 'dom', 'factories' is passed the array will contain each factory prototype currently
  provided by the factory.
  

* **destroy:** 
  To remove a DOM-node with and all cartons based on it from the factory use 
  the destroy command:
        
        F.destroy( document.getElementById( 'cartonify' ) )
  
  The destroy command will return a list of all destroyed cartons and the updated 
  css-code as a string.  `{ cartons: ..., parsed: ... }`

* **suspendParser:**
  If you have to add many nodes at once, everything will slow down – because the factory will parse
  the stylesheet again and again for every added carton. To avoid that you can suspend the parser anytime you 
  want:
        
        // suspend parser
        
        F.suspendParser( true );
        
        // add many things
        
        for ( i in list ) {
          F.add( document.getElementById( list[i] ), { styles: color: 'pink } )
        }
        
        // enable parser again 
        
        F.suspendParser( false );
        
        // trigger parse to apply changes 
        
        F.parse();

## cartonObject
The following object is an copy of the cartonObject inside of the factory source. You can overwrite 
or add values by using extend in the initial cartonFactory function call: 
 
 
    
    {   
        // for css classnames or id's generated by the factory
        
        label: 'carton',
        
        // carton types
        
        cell: { display: 'inline-block', 'vertical-align': 'top', 'font-size': 0, position: 'relative' },
        slim: { display: 'inline-block', 'vertical-align': 'top', 'font-size': 'medium', position: 'relative' },
        stretch: { display: 'block', 'vertical-align': 'top', 'font-size': 'medium', position: 'relative' }, 
        sticker: { position: 'absolute', display: 'block', 'font-size': 'medium' },
        chopped: { position: 'relative', display: 'inline', 'vertical-align': 'top', 'font-size': 'medium' },
        fixed: { position: 'fixed', display: 'block', 'font-size': 'medium' },
        fit: { position: 'absolute', display: 'block','font-size': 'medium', top: 0, left: 0, right: 0, bottom: 0 },
        
        // alignment
        
        align: {
          right: { 'text-align': 'right' },
          left: { 'text-align': 'left' },
          center: { 'text-align': 'center' }
        },
        
        // outlines
        
        show: {
          cell: { outline: '3px dashed #FF716C', 'outline-offset': '0' }, 
          slim: { outline: '6px dashed #FFFF9D', 'outline-offset': '1px' }, 
          stretch: { outline: '6px dashed #FFFF9D', 'outline-offset': '1px' }, 
          chopped: { outline: '3px dashed #99fccb', 'outline-offset': '1px' },
          sticker: { outline: '6px double #9981FF', 'outline-offset': '1px' },
          fixed: { outline: '6px double #ff97d7', 'outline-offset': '1px' },
          fit: { outline: '3px dashed lightblue', 'outline-offset': '1px' }
        },
        
        // browser specific prefixes  
        
        prefix: {
          browser: [ 'moz', 'ms', 'o', 'webkit'],
          selector: [ 'border-radius', 'box-shadow', 'box-sizing', 'column-count', 'column-gap', 'text-shadow', 'transform', 'transition', 'transition-delay', 'transition-duration', 'transition-property', 'transition-timing-function'],
          value: ['-radial-gradient', 'linear-gradient']
        },
        
        // retina settings
        
        retina: {
          query: '@media (min--moz-device-pixel-ratio: 1.3),(-o-min-device-pixel-ratio: 2.6/2), (-webkit-min-device-pixel-ratio: 1.3),(min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx)', 
          key: '@2x'
        }
    }

## Compatibility 
cartonFactory does only support modern browsers and Internet Explorer newer than version seven.

## Licence
cartonFactory is released under the [MIT License](http://www.opensource.org/licenses/MIT).


## Thanks allot
Comments or ideas are welcome at mathias_prinz@me.com!


