
export const useDragDrop = (config)=> {
     const canvas = document.createElement('canvas')
      let currentDragTarget = undefined
      const dataTransfer = document.createElement('div')
      dataTransfer.setAttribute('data-transfer-is-active','false')

      let currentDropTarget = undefined
      let dragTargetClone = undefined

     // смещение координат позиции absolute dataTransfer относительно места клика на currentDragTarget
     let dragOffsetX = 0
     let dragOffsetY = 0
     
      let {
          dragTargets,
          onDragStart,
          onDragEnd,
          onDragEnter,
          onDragLeave,
          onDragDrop
      } = config

     const setDataTransferStyle = ({dragOffsetX= 0,dragOffsetY = 0,x= 0,y= 0,opacity = 0})=> {

        // TODO merge style attr - not replace
        // if (!x && !y) {
        //     opacity = 0
        // }

        const style =   `
        position: absolute !important;
        left: ${x}px;
        top: ${y}px;
        user-select: none !important;
        opacity:${opacity};
        transform : translate(${dragOffsetX}px,${dragOffsetY}px);
        `
         dataTransfer.setAttribute('style', style );
     }
     
     const setDragTargetCloneStyle = ({width,height})=> {
          // if (!width &&  !height) {
          //     dragTargetClone.style.opacity = '0'
          // }
         const canvas = document.createElement('canvas')
         dragTargetClone.style.height = `${height}px`
         dragTargetClone.style.width = `${width}px`
         dragTargetClone.style.userSelect = 'none'
         dragTargetClone.style.margin = '0'
         dragTargetClone.setAttribute('draggable' ,'false')
     }

     const touchStartHandle = (event)=> {

         currentDragTarget = event.currentTarget
         dragTargetClone = currentDragTarget.cloneNode(true)

         dataTransfer.innerHTML = ''

         let isAbortDragStart = false

         if ( onDragStart  && currentDragTarget ) {
             isAbortDragStart =  !onDragStart(  currentDragTarget , dragTargetClone )
         }

         if ( isAbortDragStart || !event.target.draggable) {

             if (onDragEnd) {
                 onDragEnd( currentDragTarget , dragTargetClone )
             }

             currentDragTarget = undefined
             dragTargetClone = undefined
             return
         }

         if (event.cancelable) {
             event.preventDefault();
         }

         const [touch] = event.targetTouches;

         const { pageY, pageX } = touch

         const {x,y,left,top,width,height}  = currentDragTarget.getBoundingClientRect()

         dragOffsetY = pageY - currentDragTarget.offsetTop
         dragOffsetX = pageX - currentDragTarget.offsetLeft
         
         setDragTargetCloneStyle({width,height})

         dataTransfer.append( dragTargetClone )

         setDataTransferStyle({ x:currentDragTarget.offsetLeft, y:currentDragTarget.offsetTop, opacity:1})

             // dragTargetClone.style.transition =  'transform .5s'
             // dragTargetClone.style.transform = `translate(${-dragOffsetX}px,${-dragOffsetY}px)`

         document.body.append(dataTransfer)

         // setTimeout(()=> {
         //     dragTargetClone.style.transition =  'transform .5s'
         //     dragTargetClone.style.transform = `translate(${dragOffsetX}px,${dragOffsetY}px)`
         // },500)
     }

     function touchMoveHandle(event) {

          if (!currentDragTarget || !dragTargetClone) {
              return
          }

         if (event.cancelable) {
             event.preventDefault();
         }

         const [touch] = event.targetTouches;

         const {clientY, clientX,pageY,pageX} = touch

         dataTransfer.style.top = `${pageY}px`;
         dataTransfer.style.left = `${pageX}px`;

         // dragTargetClone.style.transform = `translate(${0}px,${0}px)`
         // console.log(dataTransfer.offsetLeft)

        //
        //  console.log(window.innerWidth)
        //  console.log(window.screen.width)
        //
        //  console.log(      pageX + (dataTransfer.offsetWidth / 2) , window.scrollX + screen.width )
        // if ( pageX + (dataTransfer.offsetWidth / 2) > window.scrollX + screen.width) {
        //     dataTransfer.scrollIntoView(     {behavior: "smooth", block: "center", inline: "center"} )
        //     window.scrollTo(pageX + dataTransfer.offsetWidth ,pageY +  dataTransfer.offsetHeight)
        // }

         const elementPoints = document.elementsFromPoint(clientX,clientY)

         const transferIndex =  elementPoints.findIndex((item)=> {
            return   item.hasAttribute('data-transfer-is-active');
         })

         // по индексу находим наш dataTransfer, элемент под ним и будет drop целью
        const eventDropTarget  = elementPoints[transferIndex + 1]

         if ( eventDropTarget ) {
             onDragEnter(  currentDragTarget , eventDropTarget )
         }

         if ( eventDropTarget !== currentDropTarget && currentDropTarget ) {
             onDragLeave(  currentDragTarget , currentDropTarget )
         }

         currentDropTarget  =  eventDropTarget
     }


     function touchEndHandle() {

         if (onDragEnd && currentDragTarget && dragTargetClone) {
             onDragEnd( currentDragTarget , dragTargetClone )
         }

          if ( onDragDrop && currentDragTarget && currentDropTarget ) {
              onDragDrop( currentDragTarget , currentDropTarget )
          }


          if (!currentDragTarget) {
                return
          }

         const {x,y,width,height}  = currentDragTarget.getBoundingClientRect()

         setDragTargetCloneStyle({width,height})

         setDataTransferStyle({x:currentDragTarget.offsetLeft,y:currentDragTarget.offsetTop,opacity:0})
         dataTransfer.style.zIndex = '-1'

         if (x && y) {
             dataTransfer.style.transition =  'all .5s' ;
         }


         currentDragTarget = undefined
         dragTargetClone = undefined

         setTimeout(()=> {
             dataTransfer.remove()
         },510)
     }

     function dragStartHandle(event) {

         dataTransfer.innerHTML = ''
         currentDragTarget = event.currentTarget
         dragTargetClone = currentDragTarget.cloneNode(true)

         let isAbortDragStart = false

         if ( onDragStart  && currentDragTarget ) {
             isAbortDragStart =  !onDragStart(  currentDragTarget , dragTargetClone )
         }

         if ( isAbortDragStart || !event.target.draggable || event.target instanceof(Text)) {

             if (onDragEnd) {
                 onDragEnd( currentDragTarget , dragTargetClone )
             }

             currentDragTarget = undefined
             dragTargetClone = undefined

             event.preventDefault()
             return
         }

         event.dataTransfer.setDragImage(canvas ,0,0 )

         const { pageY, pageX } = event

         const {x,y,left,top, height,width}  = currentDragTarget.getBoundingClientRect()

         dragOffsetY = -(pageY - currentDragTarget.offsetTop)
         dragOffsetX = -(pageX - currentDragTarget.offsetLeft)

         setDragTargetCloneStyle({width,height})

         dataTransfer.append(dragTargetClone)

         setDataTransferStyle({dragOffsetX, dragOffsetY, x , y  ,opacity:1 })

         document.body.append(dataTransfer)
     }


     function dragMoveHandle(event) {

         const { pageY, pageX ,clientX,clientY} = event

         if (!clientX && !clientY) {
             return
         }

         // dataTransfer.style.top = `${pageY - dragOffsetY }px`;
         // dataTransfer.style.left = `${pageX  - dragOffsetX }px`;
         dataTransfer.style.top = `${ pageY  }px`;
         dataTransfer.style.left = `${ pageX  }px`;
         // dataTransfer.style.transform = 'translate( 1rem , 1rem )';

         const elementPoints = document.elementsFromPoint(clientX,clientY)

         const transferIndex =  elementPoints.findIndex((item)=> {
             return   item.hasAttribute('data-transfer-is-active');
         })

         // по индексу находим наш dataTransfer, элемент под ним и будет drop целью
         const eventDropTarget  = elementPoints[transferIndex + 1]

         if ( eventDropTarget ) {
             onDragEnter(  currentDragTarget , eventDropTarget )
         }

         if ( eventDropTarget !== currentDropTarget && currentDropTarget ) {
             onDragLeave(  currentDragTarget , currentDropTarget )
         }


         currentDropTarget  =  eventDropTarget
     }


     function dragEndHandle(event) {

         if (onDragEnd && currentDragTarget && dragTargetClone) {
             onDragEnd( currentDragTarget , dragTargetClone )
         }

         if ( onDragDrop && currentDragTarget && currentDropTarget ) {
             onDragDrop( currentDragTarget , currentDropTarget )
         }


         if (!currentDragTarget) {
             return
         }

         const {x,y,width,height}  = currentDragTarget.getBoundingClientRect()

         setDragTargetCloneStyle({width,height})

         setDataTransferStyle({ x:currentDragTarget.offsetLeft,y:currentDragTarget.offsetTop,opacity:0})
         dataTransfer.style.zIndex = '-1'

         if (x && y) {
             dataTransfer.style.transition =  'all .5s' ;
         }

         currentDragTarget = undefined
         dragTargetClone = undefined

         setTimeout(()=> {
             dataTransfer.remove()
         },510)

     }


     const addEvents = ()=> {

         dragTargets.forEach( (item)=> {

             // if it has mouse
             item.addEventListener('dragstart', dragStartHandle);
             item.addEventListener('dragend', dragEndHandle);
             item.addEventListener("drag", dragMoveHandle);
             
             //  if it has touch screen
             item.addEventListener('touchstart', touchStartHandle);
             item.addEventListener('touchmove', touchMoveHandle);
             item.addEventListener('touchend', touchEndHandle);

         })
     };

     addEvents()

        return {

        }

    }



