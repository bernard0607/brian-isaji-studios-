// Analog Clock Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hourHand = document.querySelector('.hour-hand');
    const minHand = document.querySelector('.min-hand');
    const secondHand = document.querySelector('.second-hand');
    
    function setDate() {
        const now = new Date();
        
        // Get current time
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Calculate degrees for clock hands
        const secondsDegrees = ((seconds / 60) * 360) + 90;
        const minsDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
        const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;
        
        // Apply rotation to clock hands
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        minHand.style.transform = `rotate(${minsDegrees}deg)`;
        hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
        
        // Add/remove transition for smooth ticking
        if (seconds === 0) {
            secondHand.style.transition = 'none';
            minHand.style.transition = 'none';
            hourHand.style.transition = 'none';
        } else {
            secondHand.style.transition = 'transform 0.05s cubic-bezier(0.4, 2.3, 0.6, 1)';
            minHand.style.transition = 'transform 0.3s cubic-bezier(0.4, 2.3, 0.6, 1)';
            hourHand.style.transition = 'transform 0.5s cubic-bezier(0.4, 2.3, 0.6, 1)';
        }
    }
    
    // Initial call to set clock
    setDate();
    
    // Update clock every second
    setInterval(setDate, 1000);
    
    // Add clock ticks (optional)
    const clockFace = document.querySelector('.clock-face');
    for (let i = 1; i <= 12; i++) {
        const tick = document.createElement('div');
        tick.className = 'clock-tick';
        tick.style.transform = `rotate(${i * 30}deg)`;
        tick.style.position = 'absolute';
        tick.style.width = '2px';
        tick.style.height = '8px';
        tick.style.background = '#D4AF37';
        tick.style.left = '50%';
        tick.style.top = '5%';
        tick.style.transformOrigin = 'bottom center';
        clockFace.appendChild(tick);
    }
});
