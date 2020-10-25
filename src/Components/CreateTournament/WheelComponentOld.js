import React, { useEffect, useState, useRef } from 'react'

 const WheelComponent = ({
  segments: initialSegments,
  // segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor,
  contrastColor,
  buttonText
}) => {
  let currentSegment = ''
  let isStarted = false
  const [isFinished, setFinished] = useState(false)
  const [segments, setSegments] = useState([]);
  const [timerDelay, setTimerDelay] = useState(initialSegments.length);
  const [upTime, setUpTime] = useState(initialSegments.length * 100);
  const [downTime, setDownTime] = useState(initialSegments.length * 100);
  const [initialized, setInitialized] = useState(false);
  const latestSegs = useRef(initialSegments);

  let timerHandle = 0
  // const timerDelay = initialSegments.length
  let angleCurrent = 0
  let angleDelta = 0
  const size = 290
  let canvasContext = null
  let maxSpeed = Math.PI / `${initialSegments.length}`
  // const upTime = initialSegments.length * 100
  // const downTime = initialSegments.length * 1000
  let spinStart = 0
  let frames = 0
  const centerX = 300
  const centerY = 300

  useEffect(()=>{
    latestSegs.current = initialSegments;
  })

  useEffect(() => {
    setSegments(initialSegments);
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 0);
  }, [])

  useEffect(()=> {
    console.log("segments received: ", initialSegments);
    setSegments(initialSegments);

    setTimerDelay(initialSegments.length);
    setUpTime(initialSegments.length * 100);
    setDownTime(initialSegments.length * 100);

  }, [initialSegments])

  useEffect(()=>{
    if (!segments.length) return;
    console.log("updating segments: ",segments );
    

    wheelInit(latestSegs.current);
    
  }, [segments])


  const wheelInit = (segs) => {
    const init = initCanvas(segs);
    setInitialized(true);
    draw(segs)
  }

  const initCanvas = (segs) => {
    console.log('init canvas');
    if (!initialized) {
      let canvas = document.getElementById('canvas')
      if (navigator.appVersion.indexOf('MSIE') !== -1) {
        canvas = document.createElement('canvas')
        canvas.setAttribute('width', 1000)
        canvas.setAttribute('height', 600)
        canvas.setAttribute('id', 'canvas')
        document.getElementById('wheel').appendChild(canvas)
      }
    
      canvas.addEventListener('click', ()=>spin(segs), false);
      
      canvasContext = canvas.getContext('2d');
    }
    return true;
  }
  
  const spin = (segs) => {
    
    
    if(!segs.length) return;
console.log('spin clicked', segs);

    isStarted = true
    if (timerHandle === 0) {
      spinStart = new Date().getTime()
      // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
      maxSpeed = Math.PI / segs.length
      frames = 0
      timerHandle = setInterval(()=>onTimerTick(segs), timerDelay)
    }
  }

  const onTimerTick = (segs) => {
    if (!segs.length) return;

    frames++
    draw(segs, canvasCtx)
    const duration = new Date().getTime() - spinStart
    let progress = 0
    let finished = false
    if (duration < upTime) {
      progress = duration / upTime
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
    } else {
      if (winningSegment) {
        console.log('there is winningSegment');
        
        if (currentSegment === winningSegment && frames > segments.length) {
          progress = duration / upTime
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
          progress = 1
        } else {
          progress = duration / downTime
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
        }
      } else {
        console.log('no winningSegment');
        progress = duration / downTime
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
      }
      if (progress >= 1) finished = true
    }

    angleCurrent += angleDelta
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2
    if (finished) {
      setFinished(segments.length === 0);
      onFinished(currentSegment)
      clearInterval(timerHandle)
      timerHandle = 0
      angleDelta = 0
    }
  }

  const draw = (segs, canvasCtx) => {
    clear(canvasCtx)
    drawWheel(segs)
    drawNeedle(segs)
  }

  const drawSegment = (segs, key, lastAngle, angle) => {
    if (!segs.length) return;

    const ctx = canvasContext
    const value = segs[key]
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, size, lastAngle, angle, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = segColors[key]
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((lastAngle + angle) / 2)
    ctx.fillStyle = contrastColor || 'white'
    ctx.font = 'bold 1em proxima-nova'
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0)
    ctx.restore()
  }

  const drawWheel = (segs) => {
    if (!segs) return;

    const ctx = canvasContext
    let lastAngle = angleCurrent
    const len = segs.length
    const PI2 = Math.PI * 2
    ctx.lineWidth = 1
    ctx.strokeStyle = primaryColor || 'black'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em proxima-nova'
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent
      drawSegment(segs, i - 1, lastAngle, angle)
      lastAngle = angle
    }

    // Draw a center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, PI2, false)
    ctx.closePath()
    ctx.fillStyle = primaryColor || 'black'
    ctx.lineWidth = 10
    ctx.strokeStyle = contrastColor || 'white'
    ctx.fill()
    ctx.font = 'bold 1em proxima-nova'
    ctx.fillStyle = contrastColor || 'white'
    ctx.textAlign = 'center'
    ctx.fillText(buttonText || 'Spin', centerX, centerY + 3)
    ctx.stroke()

    // Draw outer circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, PI2, false)
    ctx.closePath()

    ctx.lineWidth = 10
    ctx.strokeStyle = primaryColor || 'black'
    ctx.stroke()
  }

  const drawNeedle = (segs) => {
    if (!segs.length) return;

    const ctx = canvasContext
    ctx.lineWidth = 1
    ctx.strokeStyle = contrastColor || 'white'
    ctx.fileStyle = contrastColor || 'white'
    ctx.beginPath()
    ctx.moveTo(centerX + 20, centerY - 50)
    ctx.lineTo(centerX - 20, centerY - 50)
    ctx.lineTo(centerX, centerY - 70)
    ctx.closePath()
    ctx.fill()
    const change = angleCurrent + Math.PI / 2
    let i =
    segs.length -
      Math.floor((change / (Math.PI * 2)) * segs.length) -
      1
    if (i < 0) i = i + segs.length
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = primaryColor || 'black'
    ctx.font = 'bold 1.5em proxima-nova'
    currentSegment = segs[i]
    isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50)
  }
  const clear = (canvasCtx) => {
    const ctx = canvasCtx ? canvasCtx : canvasContext
    ctx.clearRect(0, 0, 1000, 800)
  }
  return (
    <div id='wheel'>
      <canvas
        id='canvas'
        width='1000'
        height='800'
        style={{
          pointerEvents: isFinished ? 'none' : 'auto'
        }}
      />
    </div>
  )
}
export default WheelComponent
