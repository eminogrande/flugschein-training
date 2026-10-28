/*
 * QUESTION BANK
 * ---------------------------------------------------------------------------
 * 90 original, syllabus-style questions: ten for each of the nine TCAA PPL(A)
 * knowledge areas. Written to the syllabus and the cited regulations/textbooks,
 * they are NOT authentic TCAA examination items and no leaked paper has been
 * copied.
 *
 * Schema per item (enforced by test/schema.test.mjs):
 *   id          string, unique, kebab-case  e.g. "air-law-001"
 *   subject     string, one of window.SUBJECTS
 *   question    string
 *   options     array of exactly 4 strings
 *   answer      integer 0-3, index into options
 *   explanation string
 *   source      string, syllabus or reference (not "real exam")
 */
(function (root) {
  'use strict';

  /* The nine TCAA PPL(A) knowledge areas, Civil Aviation (Personnel Licensing)
   * Regulations 2017 reg. 42(1). Order is fixed; the start screen uses it. */
  var SUBJECTS = [
    'Air Law',
    'Aircraft General Knowledge',
    'Flight Performance, Planning and Loading',
    'Human Performance',
    'Meteorology',
    'Navigation',
    'Operational Procedures',
    'Radiotelephony',
    'Principles of Flight'
  ];

  var QUESTION_BANK = [
    {
      id: 'law-001',
      subject: 'Air Law',
      question: 'What is the minimum age for the issue of a Private Pilot Licence (Aeroplane) in Tanzania?',
      options: [
        '16 years',
        '17 years',
        '18 years',
        '21 years'
      ],
      answer: 1,
      explanation:
        'PEL reg. 41 sets 17 as the minimum age for a PPL(A). The 16-year threshold applies to a Student Pilot Licence and to glider and balloon licences, which is why 16 is the usual wrong answer.',
      source: 'TCAA PEL Regs 2017, rev. 2026, reg. 41(a)'
    },
    {
      id: 'law-002',
      subject: 'Air Law',
      question: 'What must a person hold before receiving and logging flight instruction towards a PPL(A)?',
      options: [
        'A Class 1 medical certificate only',
        'A pass in all PPL knowledge examinations',
        'A valid Student Pilot Licence',
        'Nothing, provided the instructor enters the flight in their own logbook'
      ],
      answer: 2,
      explanation:
        'Reg. 36(1) requires a valid SPL before flight instruction is received and logged. A Class 1 medical is not required for a PPL, and knowledge examinations may be taken later.',
      source: 'TCAA PEL Regs 2017, rev. 2026, reg. 36(1)'
    },
    {
      id: 'law-003',
      subject: 'Air Law',
      question: 'While flying solo on a Student Pilot Licence, may the student carry a passenger?',
      options: [
        'Yes, one passenger if the instructor has endorsed the logbook',
        'Yes, but only in day VMC',
        'No, unless the passenger pays a share of the cost',
        'No, passengers are not permitted on solo SPL flights'
      ],
      answer: 3,
      explanation:
        'SPL solo privileges exclude passenger carrying, as well as property, compensation, international flight and non-VMC flight. A logbook endorsement authorises the solo flight, but does not create a passenger privilege.',
      source: 'TCAA PEL Regs 2017, rev. 2026, reg. 38'
    },
    {
      id: 'law-004',
      subject: 'Air Law',
      question: 'Two aeroplanes are converging at the same level. Which one must give way?',
      options: [
        'The one with the other aircraft on its right',
        'The one on the left',
        'The faster aircraft',
        'Neither, both must turn left'
      ],
      answer: 0,
      explanation:
        'Under ICAO right-of-way rules the aircraft that has the other on its right gives way, while the other maintains heading and speed. Turning blindly instead of holding a predictable path is a common cause of collisions.',
      source: 'ICAO Annex 2, 3.2.2.1'
    },
    {
      id: 'law-005',
      subject: 'Air Law',
      question: 'In the air, a power-driven aeroplane and a glider are converging. Who gives way?',
      options: [
        'The glider, because it is more manoeuvrable',
        'The aircraft with the higher speed',
        'The aeroplane, because the glider is less able to manoeuvre',
        'Neither, they pass on the right'
      ],
      answer: 2,
      explanation:
        'The order of precedence makes power-driven heavier-than-air aircraft give way to balloons, gliders and airships. The glider cannot simply add power to get out of the way.',
      source: 'ICAO Annex 2, 3.2.2.2'
    },
    {
      id: 'law-006',
      subject: 'Air Law',
      question: 'An aircraft is overtaking another at the same level. Which direction must the overtaking aircraft alter heading?',
      options: [
        'To the right',
        'To the left',
        'It may choose either side',
        'It must pass underneath'
      ],
      answer: 0,
      explanation:
        'Overtaking aircraft alter heading to the right until well clear. The overtaken aircraft keeps its heading and speed, so passing on the left would put you in the other pilot\'s blind area.',
      source: 'ICAO Annex 2, 3.2.2.3'
    },
    {
      id: 'law-007',
      subject: 'Air Law',
      question: 'On a VFR cross-country at 6 500 ft in Tanzania, the planned magnetic track is 200°. Is this an appropriate cruising level?',
      options: [
        'No, tracks 180° to 359° take odd thousands plus 500 ft',
        'No, VFR must always cruise at a whole thousand feet',
        'Yes, provided ATC has cleared the level',
        'Yes, even thousands plus 500 ft suits tracks 180° to 359°'
      ],
      answer: 3,
      explanation:
        'The semi-circular rule assigns magnetic tracks 000–179° to odd thousands plus 500 ft and 180–359° to even thousands plus 500 ft, so 6 500 ft fits a 200° track. ATC may amend the level, but the flight-planned level follows the rule.',
      source: 'ICAO Annex 2, Appendix 3'
    },
    {
      id: 'law-008',
      subject: 'Air Law',
      question: 'Which cross-country flight satisfies the PPL(A) experience requirement in Tanzania?',
      options: [
        'A 100 NM flight with one full-stop landing',
        'A 270 km (150 NM) flight with full-stop landings at two different aerodromes',
        'A 180 km flight with landings at three aerodromes',
        'A 150 NM flight with one full-stop landing away from base'
      ],
      answer: 1,
      explanation:
        'Reg. 44(1)(a)(iii) requires at least one flight of 270 km (150 NM) including full-stop landings at two different aerodromes. The 180 km figure is the rotorcraft requirement, which is a frequent mix-up.',
      source: 'TCAA PEL Regs 2017, rev. 2026, reg. 44(1)(a)(iii)'
    },
    {
      id: 'law-009',
      subject: 'Air Law',
      question: 'How long is a passed PPL knowledge examination result valid?',
      options: [
        '12 months',
        '6 months',
        '24 months',
        '36 months, matching the licence period'
      ],
      answer: 0,
      explanation:
        'A knowledge-test result is valid for 12 months, after which it lapses and must be retaken. The 6-month figure applies to a practical test result, not the written papers.',
      source: 'TCAA PEL Regs 2017, rev. 2026, reg. 26(3)(a)'
    },
    {
      id: 'law-010',
      subject: 'Air Law',
      question: 'A PPL holder has flown no passengers for 100 days. What must be done before carrying passengers again?',
      options: [
        'Nothing, the licence remains valid',
        'Log five hours as PIC in the preceding 12 months',
        'Complete three take-offs and three landings in the preceding 90 days in the same category, class and type',
        'Pass a General Flight Test with a TCAA examiner'
      ],
      answer: 2,
      explanation:
        'Passenger currency needs three take-offs and three landings in the preceding 90 days in the same category, class and type; at night those must be at night. Otherwise the three take-offs and landings are flown with an instructor or examiner first. Five PIC hours in 12 months is the renewal requirement, not the passenger currency rule.',
      source: 'TCAA AC PEL01E Rev 5, §5.8'
    },
    {
      id: 'aircraft-001',
      subject: 'Aircraft General Knowledge',
      question: 'During the preflight of a Cessna 152, the fuel sampler shows a cloudy sample with droplets of water. What is the correct action?',
      options: [
        'Drain from the sump until the sample is clear of water and sediment, then finish the preflight',
        'Fly, because water is heavier than avgas and stays in the tank sump away from the engine',
        'Add a fuel-system anti-ice additive and continue with the flight',
        'Run the engine at 2000 RPM for two minutes to purge the lines before take-off'
      ],
      answer: 0,
      explanation:
        'Water is denser than avgas and collects at the lowest point of the tank, which is exactly where the sump drain sits. Keep draining until the sample is clear, because even a small slug of water reaching the carburettor will stop the engine.',
      source: 'FAA PHAK Ch. 7'
    },
    {
      id: 'aircraft-002',
      subject: 'Aircraft General Knowledge',
      question: 'You suspect carburettor icing in cruise at 2200 RPM. When you apply full carburettor heat, what should you expect?',
      options: [
        'No change at all, since carburettor heat only affects the intake air temperature',
        'An immediate and sustained rise in RPM as the ice melts',
        'An initial fall in RPM, followed by a rise as the ice clears and the engine recovers',
        'Violent engine roughness that proves ice was not present'
      ],
      answer: 2,
      explanation:
        'Carburettor heat first feeds warmer, less dense air, so RPM drops; as the ice melts and the mixture normalises, RPM recovers and may rise above the original setting. A drop with no recovery suggests the heat source or the ice is worse than assumed.',
      source: 'FAA PHAK Ch. 7'
    },
    {
      id: 'aircraft-003',
      subject: 'Aircraft General Knowledge',
      question: 'Cruising a normally aspirated light aircraft at 8500 ft on a warm day, the mixture is still fully rich and the engine runs rough. What is the correct response?',
      options: [
        'Lean the mixture until the engine runs smoothly, then enrich slightly for the cruise setting',
        'Enrich further using the primer to cool the engine',
        'Reduce power and descend, since roughness at altitude is a mechanical fault',
        'Leave the mixture full rich and accept the roughness as normal at high density altitude'
      ],
      answer: 0,
      explanation:
        'At high density altitude the air is thin, so a full-rich mixture over-fuels the engine causing roughness, plug fouling and power loss. Lean for smooth operation and best power or economy according to the aircraft\'s leaning procedure.',
      source: 'FAA PHAK Ch. 7'
    },
    {
      id: 'aircraft-004',
      subject: 'Aircraft General Knowledge',
      question: 'In climb the airspeed indicator begins to read progressively lower while the altimeter climbs normally, and the reading follows altitude changes closely. Which failure fits?',
      options: [
        'The pitot tube is blocked but the static port is clear',
        'The static port is blocked while the pitot tube remains open',
        'The airspeed indicator has simply drifted out of calibration',
        'The alternator has failed and the instrument is losing voltage'
      ],
      answer: 1,
      explanation:
        'With the static port blocked, trapped cabin pressure no longer follows ambient pressure, so the ASI behaves like a crude altimeter: under-reading in climb and over-reading in descent. The altimeter and vertical speed indicator will also lag or freeze.',
      source: 'FAA PHAK Ch. 8'
    },
    {
      id: 'aircraft-005',
      subject: 'Aircraft General Knowledge',
      question: 'During the engine run-up magneto check on a Lycoming O-235, the right magneto drops 175 RPM and the left drops 60 RPM. What does this indicate?',
      options: [
        'Normal, provided the engine remains smooth on both magnetos',
        'A faulty left magneto, since the smaller drop shows it is weak',
        'An excessive drop on the right magneto and a difference above the limit, so the aircraft should not depart until it is investigated',
        'Carburettor icing, because unequal drops are the first sign of ice'
      ],
      answer: 2,
      explanation:
        'Typical limits are about 150 RPM maximum drop per magneto and about 50 RPM maximum difference between them. A 175 RPM drop together with a 115 RPM split exceeds both, so the ignition system needs attention before flight.',
      source: 'FAA AFH Ch. 2'
    },
    {
      id: 'aircraft-006',
      subject: 'Aircraft General Knowledge',
      question: 'Why does a preflight include a visual fuel check rather than relying on the cockpit gauges?',
      options: [
        'Because the gauges are only required to be accurate when the tanks are completely empty',
        'Because the gauges read the total fuel only after the electric pump has run',
        'Because the gauges are calibrated for avgas density and read wrongly in cold weather',
        'Because gauge accuracy is deliberately poor over most of the range, so quantity must be confirmed visually and by dipstick or dip table'
      ],
      answer: 3,
      explanation:
        'Light aircraft fuel gauges are typically only required to be accurate at zero, so they can be badly misleading in the cruise range. Confirm quantity visually and with a dipstick or dip table, then compare against planned burn and reserves.',
      source: 'FAA PHAK Ch. 7'
    },
    {
      id: 'aircraft-007',
      subject: 'Aircraft General Knowledge',
      question: 'In cruise the ammeter shows a continuous discharge and the alternator warning light is on. What is the correct sequence?',
      options: [
        'Switch off the alternator, reset the field, and continue only if the warning light stays off',
        'Reduce electrical load, switch off non-essential equipment, and plan to land as soon as practicable',
        'Increase RPM to maximum continuous and continue the planned flight',
        'Continue, because the battery will be recharged by the engine-driven alternator once the load is reduced'
      ],
      answer: 1,
      explanation:
        'A steady discharge means the alternator is off line and the battery alone is supplying the electrical system, which it can do only for a limited time. Shed load to stretch the remaining battery capacity and land before the radios, flaps and lights are lost.',
      source: 'FAA PHAK Ch. 7'
    },
    {
      id: 'aircraft-008',
      subject: 'Aircraft General Knowledge',
      question: 'You inadvertently extend the flaps at 105 kt in an aircraft with an 85 kt flap limit speed. What is the main concern?',
      options: [
        'Nothing, because flaps are hydraulically damped and cannot be overstressed',
        'Structural loads on the flap surfaces and attachments, so retract them and slow down before extending again',
        'The aircraft will pitch up sharply and stall',
        'The flaps will retract automatically to the previous setting once the speed reduces'
      ],
      answer: 1,
      explanation:
        'VFE protects the flap structure from excessive air loads, which can bend or detach the surfaces or damage the linkage. Retract the flaps, slow below the limit and extend again in stages within the limitation.',
      source: 'FAA PHAK Ch. 6'
    },
    {
      id: 'aircraft-009',
      subject: 'Aircraft General Knowledge',
      question: 'Cruising at 3000 ft, oil pressure falls toward the lower red line while oil temperature stays normal. What is the most appropriate action?',
      options: [
        'Reduce power and plan to land at the nearest suitable aerodrome, monitoring the gauge',
        'Continue, since normal temperature shows the oil quantity and cooling are fine',
        'Increase power to full to raise the pump output',
        'Switch the oil cooler off to raise pressure'
      ],
      answer: 0,
      explanation:
        'Falling pressure with normal temperature points to a developing supply problem such as a leak, a failing pump or a blocked pickup, and it tends to get worse rather than better. Reduce power to lessen load and heat, and land before the engine is damaged or quits.',
      source: 'FAA PHAK Ch. 7'
    },
    {
      id: 'aircraft-010',
      subject: 'Aircraft General Knowledge',
      question: 'You enter moderate turbulence at cruise power. How should the aircraft be flown?',
      options: [
        'Maintain cruise power and hold altitude firmly with large control inputs',
        'Climb at best rate speed until the air is smooth',
        'Extend full flap to increase the wing area and ride out the bumps',
        'Reduce to manoeuvring speed or below, accept altitude variation, and keep the attitude steady'
      ],
      answer: 3,
      explanation:
        'Manoeuvring speed VA is the speed at which a full control deflection reaches the limit load, so below it the airframe is protected from gust and pilot-induced loads. Fly an attitude and let the aircraft ride the bumps instead of chasing altitude.',
      source: 'FAA PHAK Ch. 5'
    },
    {
      id: 'performance-001',
      subject: 'Flight Performance, Planning and Loading',
      question: 'An airfield has elevation 2,000 ft and QNH 1013 hPa. The temperature is +30 °C. Using 120 ft of density altitude per 1 °C above ISA, what is the approximate density altitude?',
      options: [
        'About 2,000 ft',
        'About 1,760 ft',
        'About 4,280 ft',
        'About 6,280 ft'
      ],
      answer: 2,
      explanation:
        'ISA at 2,000 ft is 15 °C minus 4 °C, i.e. 11 °C, so the air is 19 °C warmer than ISA. Density altitude is 2,000 ft plus 19 × 120 ft = 4,280 ft.',
      source: 'FAA PHAK Ch. 11'
    },
    {
      id: 'performance-002',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Take-off ground roll at 600 kg is 400 m. Using the square law and ignoring other changes, what is the approximate ground roll at 660 kg?',
      options: [
        '440 m',
        '484 m',
        '520 m',
        '400 m'
      ],
      answer: 1,
      explanation:
        'A 10 % mass increase raises the take-off distance by the square of the mass ratio: 1.10² = 1.21. 400 m × 1.21 = 484 m.',
      source: 'FAA PHAK Ch. 11'
    },
    {
      id: 'performance-003',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Runway 27 is in use. The wind is 300° at 18 kt and the aircraft limit is 15 kt crosswind. What is the crosswind component and may you take off?',
      options: [
        '9 kt; take-off permitted',
        '15.6 kt; take-off permitted',
        '9 kt; take-off not permitted',
        '18 kt; take-off permitted'
      ],
      answer: 0,
      explanation:
        'The wind is 30° off the runway centreline, so crosswind = 18 × sin 30° = 9 kt. That is below the 15 kt limit, so the take-off is within limits.',
      source: 'UK CAA Skyway Code'
    },
    {
      id: 'performance-004',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Runway 09 is in use and the wind is 120° at 20 kt. What is the longitudinal component and its sense?',
      options: [
        '17 kt headwind',
        '10 kt headwind',
        '10 kt tailwind',
        '17 kt tailwind'
      ],
      answer: 3,
      explanation:
        'The wind is 30° off the runway direction, so the component along the runway is 20 × cos 30° = 17 kt. Because the wind comes from behind the aircraft, that is a 17 kt tailwind (the 10 kt figure is the crosswind component, 20 × sin 30°).',
      source: 'UK CAA Skyway Code'
    },
    {
      id: 'performance-005',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Empty mass 500 kg at arm 0.30 m, pilot 75 kg at 0.25 m, fuel 60 kg at 0.40 m, baggage 15 kg at 0.60 m. What is the centre of gravity position?',
      options: [
        '0.28 m',
        '0.33 m',
        '0.35 m',
        '0.31 m'
      ],
      answer: 3,
      explanation:
        'Total mass is 650 kg and total moment is 150 + 18.75 + 24 + 9 = 201.75 kg·m. Dividing moment by mass gives 201.75 / 650 = 0.31 m.',
      source: 'EASA Part-FCL Mass and Balance'
    },
    {
      id: 'performance-006',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Usable fuel is 110 L and consumption is 30 L/h. Reserving 45 minutes for the final reserve, what is the maximum flight endurance available?',
      options: [
        '2 h 55 min',
        '3 h 40 min',
        '3 h 05 min',
        '2 h 10 min'
      ],
      answer: 0,
      explanation:
        'The 45 minute reserve uses 22.5 L, leaving 87.5 L for the flight. 87.5 L at 30 L/h gives 2.92 h, which is 2 h 55 min.',
      source: 'EASA Part-NCO 1305'
    },
    {
      id: 'performance-007',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Clean stalling speed is 45 kt. What is the approximate stalling speed in a 60° banked level turn?',
      options: [
        '45 kt',
        '55 kt',
        '64 kt',
        '90 kt'
      ],
      answer: 2,
      explanation:
        'At 60° bank the load factor is 1 / cos 60° = 2, and the stall speed rises by √2 = 1.41. 45 kt × 1.41 = 64 kt.',
      source: 'FAA PHAK Ch. 5'
    },
    {
      id: 'performance-008',
      subject: 'Flight Performance, Planning and Loading',
      question: 'An airfield is 1,500 ft above mean sea level with QNH 1003 hPa. Using 30 ft per hPa, what is the pressure altitude?',
      options: [
        '1,200 ft',
        '1,500 ft',
        '2,100 ft',
        '1,800 ft'
      ],
      answer: 3,
      explanation:
        'QNH is 10 hPa below 1013, giving 10 × 30 = 300 ft of error. Pressure altitude is therefore 1,500 + 300 = 1,800 ft, because the pressure is lower than standard.',
      source: 'ICAO Doc 8168 Vol. 1'
    },
    {
      id: 'performance-009',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Landing ground roll on level, dry grass is 300 m. Allowing 10 % per 1 % of downslope, what is it on a 2 % downslope?',
      options: [
        '330 m',
        '300 m',
        '390 m',
        '360 m'
      ],
      answer: 3,
      explanation:
        'A 2 % downslope adds 20 % to the ground roll, because the aircraft needs longer to shed speed. 300 m × 1.20 = 360 m.',
      source: 'Aircraft Flight Manual (generic)'
    },
    {
      id: 'performance-010',
      subject: 'Flight Performance, Planning and Loading',
      question: 'Total mass is 700 kg. A 20 kg item is moved aft from station 0.20 m to station 0.80 m. By how much and in which direction does the CG move?',
      options: [
        '17 mm aft',
        '17 mm forward',
        '60 mm aft',
        '6 mm aft'
      ],
      answer: 0,
      explanation:
        'The moment change is 20 kg × 0.60 m = 12 kg·m aft. Dividing by the 700 kg total gives 0.017 m, i.e. 17 mm aft.',
      source: 'EASA Part-FCL Mass and Balance'
    },
    {
      id: 'human-001',
      subject: 'Human Performance',
      question: 'Unpressurised at 10 000 ft on a warm afternoon, a pilot notices tingling fingers, light-headedness, a slight headache and unusual euphoria. What is happening?',
      options: [
        'Hyperventilation from anxiety about the altitude',
        'Carbon monoxide poisoning from the cabin heater',
        'Hypoxia from the reduced oxygen partial pressure, with impaired judgement following quickly',
        'Decompression sickness from the rate of climb'
      ],
      answer: 2,
      explanation:
        'Tingling, light-headedness, headache and euphoria are classic hypoxic symptoms, and the reduced oxygen partial pressure at altitude is the cause. The dangerous part is that judgement degrades early, so the pilot may not recognise the problem without a prompt or an oxygen check.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-002',
      subject: 'Human Performance',
      question: 'A pilot under stress breathes rapidly and deeply, and reports dizziness, tingling in the hands and around the mouth. What is the first thing to do?',
      options: [
        'Take several slow, deep breaths, then consciously slow the breathing rate and talk aloud',
        'Descend immediately at maximum rate to a lower altitude',
        'Use the emergency oxygen bottle at full flow',
        'Hold the breath for 30 seconds until the dizziness passes'
      ],
      answer: 0,
      explanation:
        'These signs fit hyperventilation, which washes out carbon dioxide and produces dizziness, tingling and sometimes carpopedal spasm. Consciously slowing the rate restores the balance; if symptoms persist, treat for hypoxia as well since the two can look alike.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-003',
      subject: 'Human Performance',
      question: 'In winter cruise with the cabin heater on, the pilot develops a dull headache and slight nausea, and a passenger becomes drowsy. The engine runs normally. What is the likely cause and action?',
      options: [
        'Hypoxia from the cruise altitude; descend and land',
        'Carbon monoxide from an exhaust leak into the heat shroud; open fresh air, heater off, land and have it inspected',
        'Motion sickness; look outside and continue',
        'Fuel vapour in the cockpit; lean the mixture and continue'
      ],
      answer: 1,
      explanation:
        'The cabin heater takes air from around the exhaust, so a leak or crack can pump carbon monoxide into the cockpit, causing headache, nausea and drowsiness without any engine indication. Fresh air and heater off reduce exposure, and the source must be found before further flight.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-004',
      subject: 'Human Performance',
      question: 'On a dark night with little outside visual reference, you apply go-around power and accelerate. The pilot\'s sensation is a strong nose-up attitude. What is this and what is the correct response?',
      options: [
        'A somatogravic illusion; hold the attitude on the attitude indicator rather than pushing forward on sensation',
        'A false climb from the altimeter lag; ignore it and climb at best rate',
        'The coriolis effect; look left and right to reset the inner ear',
        'A genuine pitch-up from the trim change; push forward firmly until the sensation stops'
      ],
      answer: 0,
      explanation:
        'Linear acceleration is sensed by the otoliths much like a pitch-up, so the pilot is tempted to push forward and lose the climb path. Trust the flight instruments, hold the intended attitude and allow the aircraft to accelerate to the target speed.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-005',
      subject: 'Human Performance',
      question: 'For the best chance of seeing a dim object at night, how should the eyes be used?',
      options: [
        'Look directly at it, because central vision is most sensitive in the dark',
        'Scan slowly with the object 5 to 10 degrees off centre, using peripheral vision',
        'Blink rapidly and focus on the brightest part of the sky',
        'Keep the eyes still and stare at a fixed point until the object appears'
      ],
      answer: 1,
      explanation:
        'The fovea is packed with cones and is poor in low light, while the rod-rich area around it detects dim images best. Looking slightly off centre puts the object on the rods, and slow scanning stops the image fading as the receptors adapt.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-006',
      subject: 'Human Performance',
      question: 'Which combination best matches the usual civil guidance on alcohol before flying?',
      options: [
        'Four hours from the last drink, with no blood alcohol limit',
        'Twelve hours from the last drink, whatever the amount',
        'No alcohol for eight hours and a blood alcohol level below 0.04 percent, plus no hangover',
        'No limit, provided the pilot feels alert and has eaten'
      ],
      answer: 2,
      explanation:
        'The familiar rule is eight hours bottle-to-throttle with blood alcohol below 0.04 percent, but the hangover and dehydration matter as much as the number. Alcohol also disturbs sleep and reduces night vision, so feeling fine is not the same as being fit.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-007',
      subject: 'Human Performance',
      question: 'An hour into a two-hour leg the weather drops to marginal VFR, but the destination is your home base with a hangar and a mechanic. What keeps the pilot pressing on?',
      options: [
        'Plan continuation bias, the pull of the planned destination, supported by familiar-home-base reasoning',
        'Spatial disorientation, because the horizon is unclear',
        'The startle effect, which blocks any alternative plan',
        'Channelised attention, from concentrating on the instruments'
      ],
      answer: 0,
      explanation:
        'Plan continuation bias keeps a pilot following the original plan as conditions decay, and sunk cost plus a comfortable destination makes diverting feel like failure. Naming the decision point and a diversion field before departure is the standard defence.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-008',
      subject: 'Human Performance',
      question: 'A pilot flies a four-hour summer leg with no water and becomes noticeably dehydrated. What is the practical effect in the cockpit?',
      options: [
        'Improved alertness, because less fluid means fewer toilet stops',
        'Reduced reaction time, degraded concentration and earlier fatigue, plus faster onset of altitude effects',
        'Only a dry mouth, with no measurable performance change',
        'Lower blood oxygen saturation but no effect on decision making'
      ],
      answer: 1,
      explanation:
        'Loss of around two percent of body water already degrades reaction time, concentration and short-term memory, and adds to fatigue. Dehydration also worsens the effect of heat and altitude, so carry and drink water on longer legs.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-009',
      subject: 'Human Performance',
      question: 'Which flight profile is most exposed to the natural circadian low in alertness?',
      options: [
        'A late morning local flight after a normal night\'s sleep',
        'An early evening flight after a light meal',
        'Any flight flown with two pilots on board',
        'A pre-dawn departure or a mid-afternoon leg after a short night'
      ],
      answer: 3,
      explanation:
        'Alertness dips in the early hours, roughly 02:00 to 06:00, and again in the early afternoon, roughly 14:00 to 16:00. A pre-dawn start or a post-lunch leg on short sleep stacks the circadian dip on top of sleep debt and raises the risk of a micro-sleep.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'human-010',
      subject: 'Human Performance',
      question: 'On a black night approach to a runway with no approach lighting and dark ground all around, what illusion is likely and how is it countered?',
      options: [
        'A black-hole effect makes the aircraft seem low, so the pilot flies a high, flat approach',
        'The runway seems narrower, so the pilot flares too late',
        'The runway slope illusion makes the pilot touch down long',
        'A black-hole effect makes the aircraft seem high, so the pilot descends too low and lands short'
      ],
      answer: 3,
      explanation:
        'With no peripheral lights the runway appears to sit higher than it does, so the pilot descends low and lands short. Counter it with a stabilised approach, the VASI or PAPI if fitted, and instrument reference for the flight path rather than the picture alone.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'meteorology-001',
      subject: 'Meteorology',
      question: 'In the International Standard Atmosphere, what is the temperature at 10,000 ft?',
      options: [
        '+5 °C',
        '0 °C',
        '−15 °C',
        '−5 °C'
      ],
      answer: 3,
      explanation:
        'ISA starts at 15 °C at sea level and falls 1.98 °C per 1,000 ft. At 10,000 ft that is 15 − 19.8 = −4.8 °C, about −5 °C.',
      source: 'ICAO Doc 7488'
    },
    {
      id: 'meteorology-002',
      subject: 'Meteorology',
      question: 'Cruising on a constant QNH setting from an area of 1022 hPa into an area of 998 hPa, what happens?',
      options: [
        'The altimeter over-reads and true altitude is lower than indicated',
        'The altimeter under-reads and true altitude is higher than indicated',
        'The altimeter is unaffected because the setting was not changed',
        'The altimeter over-reads and true altitude is higher than indicated'
      ],
      answer: 0,
      explanation:
        'Flying towards lower pressure without resetting makes the altimeter indicate too high. The aircraft is therefore lower than the instrument shows, which is the classic terrain-clearance trap.',
      source: 'ICAO Annex 6 / PANS-OPS'
    },
    {
      id: 'meteorology-003',
      subject: 'Meteorology',
      question: 'In which conditions is carburettor icing most likely with a piston engine?',
      options: [
        '−20 °C in dry air',
        'Ambient +5 °C with high relative humidity',
        'Ambient +35 °C in dry air',
        '−5 °C with very low relative humidity'
      ],
      answer: 1,
      explanation:
        'Fuel vaporisation and venturi cooling can drop the throttle temperature by about 20 °C. The risk peaks near +5 °C with high humidity, and carburettor heat is the correct response.',
      source: 'FAA PHAK Ch. 7'
    },
    {
      id: 'meteorology-004',
      subject: 'Meteorology',
      question: 'Surface temperature is 18 °C and the dewpoint is 15 °C. Using 400 ft of cloud base per 1 °C of spread, what is the expected convective cloud base?',
      options: [
        'About 300 ft',
        'About 750 ft',
        'About 1,200 ft',
        'About 4,000 ft'
      ],
      answer: 2,
      explanation:
        'The spread is 3 °C and rising air cools about 3 °C per 1,000 ft until saturation. 3 × 400 ft = 1,200 ft, the approximate condensation level.',
      source: 'FAA PHAK Ch. 6'
    },
    {
      id: 'meteorology-005',
      subject: 'Meteorology',
      question: 'Which cloud sequence typically precedes the passage of a warm front?',
      options: [
        'St, Ns, As, Cs, Ci',
        'Ci, Cs, As, Ns, St',
        'Cu, Tcu, Cb, Sc',
        'Ns, Cb, Ci, Ac'
      ],
      answer: 1,
      explanation:
        'A warm front approaches with high cirrus, thickening to cirrostratus and altostratus, then lowering to nimbostratus with continuous rain and finally stratus. The base falls steadily as the front nears.',
      source: 'ICAO Annex 3 / Met. Handbook'
    },
    {
      id: 'meteorology-006',
      subject: 'Meteorology',
      question: 'Which hazard is characteristic of the mature stage of a thunderstorm?',
      options: [
        'Smooth air and steadily improving visibility',
        'Only light continuous rain with no gusts',
        'Hail, microburst downdrafts and a strong gust front',
        'Steady laminar updraughts with no precipitation'
      ],
      answer: 2,
      explanation:
        'In the mature stage updraught and downdraught coexist, producing hail, lightning, heavy rain and a cold gust front. Microbursts from the downdraught are the most serious low-level hazard.',
      source: 'FAA PHAK Ch. 12'
    },
    {
      id: 'meteorology-007',
      subject: 'Meteorology',
      question: 'When is a coastal sea breeze strongest on a clear, calm summer day?',
      options: [
        'Just before sunrise',
        'In the early morning after sunrise',
        'Immediately after sunset',
        'In the mid to late afternoon'
      ],
      answer: 3,
      explanation:
        'The land heats faster than the sea, so the pressure difference and onshore flow build through the day and peak in mid to late afternoon. It decays after sunset as the land cools.',
      source: 'FAA PHAK Ch. 12'
    },
    {
      id: 'meteorology-008',
      subject: 'Meteorology',
      question: 'On final approach at 1,000 ft you encounter a sudden 15 kt airspeed loss in wind shear. What is the correct response?',
      options: [
        'Lower the nose to keep the aim point and wait for the speed to return',
        'Add power and accept a higher approach speed, being ready to go around',
        'Reduce power and raise the nose to hold the glideslope',
        'Retrim for the lower speed and continue the normal approach'
      ],
      answer: 1,
      explanation:
        'A shear-induced speed loss with a fixed power setting leaves the aircraft low on energy and prone to undershooting. Adding power and guarding against a stall restores the margin; if it cannot be regained, go around.',
      source: 'ICAO Doc 8168 Vol. 1'
    },
    {
      id: 'meteorology-009',
      subject: 'Meteorology',
      question: 'What does the altimeter subscale setting QFE give when set on the ground at the departure airfield?',
      options: [
        'Altitude above mean sea level',
        'Height above the aerodrome reference point',
        'Flight level above the standard datum',
        'Density altitude at the aerodrome'
      ],
      answer: 1,
      explanation:
        'QFE is the pressure at the aerodrome reference point, so the altimeter reads zero there and then shows height above the aerodrome. QNH, by contrast, gives altitude above mean sea level.',
      source: 'ICAO Annex 5'
    },
    {
      id: 'meteorology-010',
      subject: 'Meteorology',
      question: 'Which conditions favour the formation of radiation fog?',
      options: [
        'Clear sky, light wind, high humidity and a long night',
        'Strong wind, overcast sky and a small temperature/dewpoint spread',
        'Warm, dry air moving over a cold sea surface',
        'Strong daytime heating with a large temperature/dewpoint spread'
      ],
      answer: 0,
      explanation:
        'Radiation fog needs rapid overnight cooling to bring the temperature to the dewpoint, so a clear sky and light wind are ideal. Strong wind mixes the air and suppresses it; the small spread then favours fog.',
      source: 'ICAO Annex 3 / Met. Handbook'
    },
    {
      id: 'navigation-001',
      subject: 'Navigation',
      question: 'True track is 090°. Variation is 10° West and deviation is 3° East. What compass heading is required?',
      options: [
        '103°',
        '097°',
        '083°',
        '077°'
      ],
      answer: 1,
      explanation:
        'East is least and west is best when converting true to compass: add the west variation and subtract the east deviation: 090 + 10 − 3 = 097°. Checking back the other way, 097C + 3E deviation = 100M, and 100M minus 10W variation = 090T.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'navigation-002',
      subject: 'Navigation',
      question: 'True track 360°, TAS 120 kt, wind 270°/30 kt. What heading and groundspeed result?',
      options: [
        '346° and 116 kt',
        '014° and 116 kt',
        '346° and 120 kt',
        '334° and 124 kt'
      ],
      answer: 0,
      explanation:
        'The wind is a full crosswind from the left. sin WCA = 30/120 gives a 14° wind correction angle to the left, so heading 346°, and groundspeed = 120 × cos 14° = 116 kt.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'navigation-003',
      subject: 'Navigation',
      question: 'After 60 NM on a planned track you find yourself 4 NM right of track. Using the 1-in-60 rule, what is the track error?',
      options: [
        '2°',
        '4°',
        '8°',
        '15°'
      ],
      answer: 1,
      explanation:
        'The 1-in-60 rule states that 1 NM of offset in 60 NM equals 1°. Four miles in 60 NM is therefore a 4° track error, to be corrected by an equal amount to regain track.',
      source: 'UK CAA Skyway Code'
    },
    {
      id: 'navigation-004',
      subject: 'Navigation',
      question: 'The next leg is 150 NM and expected groundspeed is 100 kt. Departing at 10:20, what is the ETA?',
      options: [
        '11:20',
        '11:50',
        '12:20',
        '12:50'
      ],
      answer: 1,
      explanation:
        '150 NM at 100 kt takes 1.5 hours, i.e. 90 minutes. Adding that to a 10:20 departure gives an ETA of 11:50.',
      source: 'FAA PHAK Ch. 16'
    },
    {
      id: 'navigation-005',
      subject: 'Navigation',
      question: 'A leg takes 45 minutes and the engine burns 40 L/h. How much fuel is required for the leg alone?',
      options: [
        '20 L',
        '30 L',
        '45 L',
        '60 L'
      ],
      answer: 1,
      explanation:
        '45 minutes is 0.75 of an hour. 40 L/h × 0.75 h = 30 L, before adding taxi, climb and reserve fuel.',
      source: 'EASA Part-NCO 1305'
    },
    {
      id: 'navigation-006',
      subject: 'Navigation',
      question: 'Why should a turn onto north be stopped before the compass reads 360° in the northern hemisphere?',
      options: [
        'Because the compass under-reads in a turn through north and would overshoot the heading',
        'Because the compass over-reads in a turn through north and would stop short',
        'Because deviation is greatest on north',
        'Because variation is applied only on north and south headings'
      ],
      answer: 0,
      explanation:
        'Magnetic dip pulls the compass during turns, and through north the compass lags, under-reading. Following it would overshoot, so the turn is stopped early and rolled out on the reference heading.',
      source: 'FAA PHAK Ch. 8'
    },
    {
      id: 'navigation-007',
      subject: 'Navigation',
      question: 'You are on the 090° radial of a VOR. What is the magnetic bearing to the station?',
      options: [
        '090°',
        '180°',
        '270°',
        '360°'
      ],
      answer: 2,
      explanation:
        'A radial is measured outbound from the station, so being on the 090° radial places you east of it. The bearing back to the station is the reciprocal, 270°.',
      source: 'ICAO Annex 10 Vol. 1'
    },
    {
      id: 'navigation-008',
      subject: 'Navigation',
      question: 'On a topographical chart, what does a group of closely spaced contour lines indicate?',
      options: [
        'A gentle slope with even drainage',
        'A steep slope or escarpment',
        'A ridge running along the lines',
        'Flat ground above 1,000 ft'
      ],
      answer: 1,
      explanation:
        'Contours join points of equal elevation, so the closer they are the faster the height changes over a given distance. Tightly packed lines mean a steep slope and strong mechanical turbulence in wind.',
      source: 'ICAO Annex 4'
    },
    {
      id: 'navigation-009',
      subject: 'Navigation',
      question: 'Compared with a great circle route between the same two points, a rhumb line is:',
      options: [
        'Shorter and flown at a constant heading',
        'Longer and flown at a constant heading',
        'Longer and flown at a constantly changing heading',
        'Identical in length and heading'
      ],
      answer: 1,
      explanation:
        'A rhumb line crosses every meridian at the same angle, so the heading is constant but the distance is longer than a great circle. Great circles are the shortest path but need a continuously changing heading.',
      source: 'ICAO Annex 4'
    },
    {
      id: 'navigation-010',
      subject: 'Navigation',
      question: 'A chart has a scale of 1:500,000. What ground distance does 1 cm represent?',
      options: [
        '0.5 km',
        '2 km',
        '50 km',
        '5 km'
      ],
      answer: 3,
      explanation:
        '1:500,000 means 1 cm on the chart equals 500,000 cm on the ground, which is 5,000 m or 5 km. The same scale is about 6.9 NM per inch, so ground features look small and detail must be checked carefully.',
      source: 'ICAO Annex 4'
    },
    {
      id: 'ops-001',
      subject: 'Operational Procedures',
      question: 'Besides the required manoeuvre training, what must be completed before a student\'s first solo?',
      options: [
        'A TCAA written examination pass',
        'Ten hours of dual instruction',
        'A Class 1 medical certificate',
        'An instructor-administered knowledge test on the rules, aerodrome procedures and aircraft limitations, with wrong answers reviewed'
      ],
      answer: 3,
      explanation:
        'Reg. 37 requires the instructor to test the student on the applicable rules, the aerodrome\'s airspace and procedures, and the type\'s characteristics and limits, then review incorrect answers. No fixed pre-solo hour figure and no TCAA written paper are prescribed.',
      source: 'TCAA PEL Regs 2017, rev. 2026, reg. 37(1)-(3)'
    },
    {
      id: 'ops-002',
      subject: 'Operational Procedures',
      question: 'The engine fails at about 300 ft after take-off with most of the runway still ahead. The safest initial action is to:',
      options: [
        'Turn back immediately for the reciprocal runway',
        'Lower the nose, land ahead, and only turn if height allows',
        'Climb straight ahead to 1 000 ft before turning',
        'Apply carburettor heat and hold the altitude'
      ],
      answer: 1,
      explanation:
        'Below roughly 500 ft there is usually not enough height to complete a turn back, so pitch for the best glide and land ahead within the cleared area. Turning back low is the classic low-level stall/spin accident.',
      source: 'TCAA PPL(A) GFT form PEL022D; PPL(A) emergency syllabus'
    },
    {
      id: 'ops-003',
      subject: 'Operational Procedures',
      question: 'Under which conditions is carburettor icing most likely?',
      options: [
        'Air temperature between about -7 °C and +21 °C with high relative humidity',
        'Air temperature below -20 °C in dry air',
        'Air temperature above +30 °C in dry air',
        'Only when visible moisture is falling as rain'
      ],
      answer: 0,
      explanation:
        'Vapourisation in the carburettor can chill the air by around 20 °C, so icing occurs in mild, humid conditions well above freezing. Very cold dry air holds little moisture and is less conducive.',
      source: 'PPL(A) aircraft general knowledge / ops syllabus'
    },
    {
      id: 'ops-004',
      subject: 'Operational Procedures',
      question: 'Departing from a high-elevation aerodrome on a hot afternoon affects take-off performance how?',
      options: [
        'Ground roll shortens because the air is thinner',
        'No effect, provided the mixture is leaned correctly',
        'Ground roll lengthens and the initial climb gradient reduces',
        'Only the landing distance is affected'
      ],
      answer: 2,
      explanation:
        'High density altitude reduces both lift and engine power, so the ground roll lengthens and the climb gradient falls. Leaning the mixture recovers some power but does not restore the aerodynamic loss.',
      source: 'PPL(A) flight performance and planning syllabus'
    },
    {
      id: 'ops-005',
      subject: 'Operational Procedures',
      question: 'Departing behind a heavy aeroplane, how do you minimise wake-turbulence encounter?',
      options: [
        'Rotate after the heavy\'s touchdown point and stay below its path',
        'Rotate before its touchdown point and remain above and upwind of its flight path',
        'Follow directly in its flight path at the same height',
        'Delay rotation and climb steeply through its path'
      ],
      answer: 1,
      explanation:
        'Wingtip vortices sink and drift downwind from the flight path, and are strongest when the generating aircraft is heavy, clean and slow. Lifting off earlier and staying above and upwind keeps you clear of the core.',
      source: 'ICAO wake-turbulence avoidance guidance; PPL ops syllabus'
    },
    {
      id: 'ops-006',
      subject: 'Operational Procedures',
      question: 'What is the first action in a stall recovery?',
      options: [
        'Apply full power',
        'Pull back to raise the nose above the horizon',
        'Apply carburettor heat',
        'Reduce the angle of attack by easing forward on the control column'
      ],
      answer: 3,
      explanation:
        'A stall is an angle-of-attack problem, so the wing must be unstalled by reducing the angle of attack before power is added. Pulling back during a stall deepens it, and full power alone can worsen the yaw and wing drop.',
      source: 'PPL(A) flight training syllabus; aircraft flight manual'
    },
    {
      id: 'ops-007',
      subject: 'Operational Procedures',
      question: 'Loading an aeroplane with the centre of gravity near the aft limit causes:',
      options: [
        'Lighter stick forces and a greater tendency to stall',
        'Increased longitudinal stability',
        'A higher stalling speed and longer landing roll',
        'No handling change, only a paperwork issue'
      ],
      answer: 0,
      explanation:
        'An aft CG shortens the moment arm of the tail and reduces pitch stability, giving light controls and a greater tendency to enter a stall or spin. A forward CG instead gives heavier controls and a higher stall speed.',
      source: 'PPL(A) flight performance, planning and loading syllabus'
    },
    {
      id: 'ops-008',
      subject: 'Operational Procedures',
      question: 'Which items belong in the passenger briefing before take-off?',
      options: [
        'The route, cruising level and estimated time of arrival',
        'The weather forecast and the fuel state',
        'Seat belts, doors and exits, and smoking rules',
        'The aircraft type and the pilot\'s licence details'
      ],
      answer: 2,
      explanation:
        'The briefing must cover the practical safety items a passenger may have to use: belts, doors, exits and emergency equipment, plus no-smoking. Route and weather detail is useful but not the required content.',
      source: 'ICAO Annex 6, Part II; PPL ops syllabus'
    },
    {
      id: 'ops-009',
      subject: 'Operational Procedures',
      question: 'When must fuel be drained from the sumps and checked for water and sediment?',
      options: [
        'Only after refuelling from a bowser',
        'Once every 24 hours regardless of refuelling',
        'Only when the engine has been difficult to start',
        'Before the first flight of the day, and after any refuelling'
      ],
      answer: 3,
      explanation:
        'Water settles in the lowest points, so drains are checked before the first flight of the day and again after refuelling, when contamination is most likely to be introduced. A 24-hour rule misses a refuel that happens later the same day.',
      source: 'PPL(A) pre-flight procedures syllabus; aircraft flight manual'
    },
    {
      id: 'ops-010',
      subject: 'Operational Procedures',
      question: 'Which documents must be carried on board during a PPL cross-country flight in Tanzania?',
      options: [
        'The maintenance schedule',
        'The Certificate of Registration and the Certificate of Airworthiness',
        'The ATO training manual',
        'The pilot\'s training file'
      ],
      answer: 1,
      explanation:
        'The registration and airworthiness certificates establish the aircraft\'s legal identity and airworthy status and must be on board, with the licence and medical for the crew. Maintenance records and training files stay with the operator or school.',
      source: 'ICAO Annex 8 / TCAA airworthiness requirements'
    },
    {
      id: 'rt-001',
      subject: 'Radiotelephony',
      question: 'Which spoken signal announces a distress condition?',
      options: [
        'PAN PAN',
        'SECURITE',
        'MAYDAY',
        'EMERGENCY'
      ],
      answer: 2,
      explanation:
        'MAYDAY, spoken three times, prefixes a distress call for serious or imminent danger needing immediate assistance. PAN PAN is the urgency call for a situation that is not immediately life-threatening.',
      source: 'ICAO Annex 10 Vol II, Ch. 5'
    },
    {
      id: 'rt-002',
      subject: 'Radiotelephony',
      question: 'An aircraft has a sick passenger but no immediate danger to the flight. Which signal is used?',
      options: [
        'PAN PAN, PAN PAN, PAN PAN',
        'MAYDAY MAYDAY MAYDAY',
        'SECURITE',
        'STANDBY'
      ],
      answer: 0,
      explanation:
        'PAN PAN, spoken three times, marks an urgency message: a serious situation that does not yet require immediate assistance. MAYDAY is reserved for distress.',
      source: 'ICAO Annex 10 Vol II, Ch. 5'
    },
    {
      id: 'rt-003',
      subject: 'Radiotelephony',
      question: 'Which transponder code is selected after a two-way radio failure?',
      options: [
        '7 500',
        '7 600',
        '7 700',
        '2 000'
      ],
      answer: 1,
      explanation:
        '7 600 is the standard code for communication failure, 7 500 for unlawful interference and 7 700 for a general emergency. Selecting 7 700 after a radio failure is a common slip.',
      source: 'ICAO Annex 10 Vol II; ICAO Doc 9432'
    },
    {
      id: 'rt-004',
      subject: 'Radiotelephony',
      question: 'Which transponder code indicates unlawful interference?',
      options: [
        '7 600',
        '7 700',
        '7 000',
        '7 500'
      ],
      answer: 3,
      explanation:
        '7 500 signals hijacking or unlawful interference. The three emergency codes are easy to transpose, so learn them as a set: 7 500 seized, 7 600 no radio, 7 700 emergency.',
      source: 'ICAO Annex 10 Vol II'
    },
    {
      id: 'rt-005',
      subject: 'Radiotelephony',
      question: 'How are the numbers 3, 5 and 9 pronounced in ICAO radiotelephony?',
      options: [
        'TREE, FIFE, NINER',
        'THREE, FIVE, NINE',
        'THUH-REE, FI-YIV, NI-YEN',
        'THREE, FIFE, NINER'
      ],
      answer: 0,
      explanation:
        'All three take the ICAO spelling pronunciations TREE, FIFE and NINER to avoid mishearing over a noisy channel. Each is a deliberate distortion of the normal spoken word.',
      source: 'ICAO Annex 10 Vol II, Ch. 5'
    },
    {
      id: 'rt-006',
      subject: 'Radiotelephony',
      question: 'Which of these instructions must be read back in full?',
      options: [
        '"Standby"',
        '"Squawk 7421"',
        '"Roger"',
        '"Monitor tower 118.1"'
      ],
      answer: 1,
      explanation:
        'SSR codes, level, heading and speed instructions, runway-in-use, altimeter settings and runway clearances all require readback. Standby is only an acknowledgement, and Roger is itself an acknowledgement.',
      source: 'ICAO Annex 10 Vol II, Ch. 4; Doc 9432'
    },
    {
      id: 'rt-007',
      subject: 'Radiotelephony',
      question: 'Two-way radio failure occurs in VMC in controlled airspace. What should the pilot do?',
      options: [
        'Climb to the last assigned level and hold',
        'Squawk 7 700 and continue to the planned destination',
        'Circle overhead and wait for light signals',
        'Continue in VMC, land at the nearest suitable aerodrome and report arrival'
      ],
      answer: 3,
      explanation:
        'In VMC the pilot continues visually, lands at the nearest suitable aerodrome and reports arrival by the quickest means. Light signals are the fallback when the failure happens in IMC or when a landing clearance is needed at a controlled aerodrome.',
      source: 'ICAO Annex 2, 3.8; Doc 9432'
    },
    {
      id: 'rt-008',
      subject: 'Radiotelephony',
      question: 'Which is the correct initial call to a tower when five miles south inbound to land?',
      options: [
        '"Tower, Cessna 172, request landing"',
        '"Cessna 172 calling tower, do you read?"',
        '"Tower, Cessna 172, five miles south, inbound landing"',
        '"Tower, here is Cessna 172 inbound"'
      ],
      answer: 2,
      explanation:
        'The initial call gives station called, callsign, position and intention so the controller can plan without a second exchange. Omitting position is the usual student error and forces a query.',
      source: 'ICAO Doc 9432, Ch. 4'
    },
    {
      id: 'rt-009',
      subject: 'Radiotelephony',
      question: 'What does the clearance "line up and wait" authorise?',
      options: [
        'Enter the runway and stop, awaiting take-off clearance',
        'Enter the runway and begin the take-off roll',
        'Hold at the holding point until further instructed',
        'Backtrack the runway and vacate at the far end'
      ],
      answer: 0,
      explanation:
        'Line up and wait means enter and align on the runway but do not start the roll; take-off clearance follows separately. Treating it as a take-off clearance and rolling is a common and serious error.',
      source: 'ICAO Doc 9432, Ch. 5'
    },
    {
      id: 'rt-010',
      subject: 'Radiotelephony',
      question: 'What does the word WILCO mean?',
      options: [
        'Message received',
        'Repeat the last transmission',
        'Confirm my last transmission',
        'Understood and will comply'
      ],
      answer: 3,
      explanation:
        'WILCO is a contraction of \'will comply\' and carries both understanding and intent to act. ROGER only confirms receipt, and SAY AGAIN asks for a repetition.',
      source: 'ICAO Annex 10 Vol II, Ch. 5; Doc 9432'
    },
    {
      id: 'principles-001',
      subject: 'Principles of Flight',
      question: 'As a light aircraft accelerates in level flight from just above the stall to cruising speed, how does induced drag change?',
      options: [
        'It increases, because dynamic pressure rises with the square of speed',
        'It decreases, because the wing needs a smaller angle of attack and produces less downwash',
        'It stays constant while the aircraft holds level flight',
        'It first increases, peaks at best glide speed, then decreases'
      ],
      answer: 1,
      explanation:
        'Induced drag comes from lift and is greatest at high angle of attack, low speed. As speed rises the wing meets the same lift requirement at a smaller angle of attack with less downwash, so induced drag falls, which is why total drag has a minimum at the speed where induced and parasite drag cross.',
      source: 'FAA PHAK Ch. 5'
    },
    {
      id: 'principles-002',
      subject: 'Principles of Flight',
      question: 'In a level 45 degree bank the load factor is 1.41. What does that do to the power-off stall speed?',
      options: [
        'Nothing, because stall depends only on angle of attack',
        'Raises it by about 19 percent, roughly 48 kt for a 40 kt aircraft',
        'Raises it by about 41 percent, roughly 56 kt for a 40 kt aircraft',
        'Lowers it, because the inner wing accelerates in the turn'
      ],
      answer: 1,
      explanation:
        'The accelerated stall speed rises with the square root of the load factor, and the square root of 1.41 is 1.19, so stall speed goes up by about 19 percent. That is why a steep turn close to the buffet can stall the aircraft without any speed change on the ASI.',
      source: 'FAA PHAK Ch. 5'
    },
    {
      id: 'principles-003',
      subject: 'Principles of Flight',
      question: 'At what angle of attack does a wing stall?',
      options: [
        'At the critical angle, which stays essentially the same whatever the weight, bank angle or speed',
        'At a fixed airspeed, whatever the weight carried',
        'At an angle that rises with weight because more lift is needed',
        'At an angle that depends on the height above ground because of ground effect'
      ],
      answer: 0,
      explanation:
        'The stall is an angle-of-attack event at the critical angle where the airflow separates. Weight, bank, density altitude and speed change the speed at which that angle is reached, but not the angle itself.',
      source: 'FAA PHAK Ch. 4'
    },
    {
      id: 'principles-004',
      subject: 'Principles of Flight',
      question: 'Rolling into a turn, the aircraft yaws away from the intended turn direction. What causes this and what corrects it?',
      options: [
        'P-factor; correct with power reduction',
        'Adverse yaw from the raised aileron\'s extra drag; correct with rudder into the turn',
        'Aileron reversal from wing flex; correct by applying opposite aileron',
        'Dutch roll from dihedral; correct with pitch input'
      ],
      answer: 1,
      explanation:
        'The downgoing aileron produces more lift and more induced drag, dragging that wing back, so the nose yaws away from the turn. Apply coordinated rudder with the aileron, and reduce the aileron input near the buffet where the effect is strongest.',
      source: 'FAA PHAK Ch. 6'
    },
    {
      id: 'principles-005',
      subject: 'Principles of Flight',
      question: 'Which statement about landing with full flap is correct?',
      options: [
        'It allows a slower approach and shorter landing roll, at the cost of a lower nose attitude and reduced go-around climb performance',
        'It raises the stall speed but improves go-around performance',
        'It has no effect on the approach path, only on pitch trim',
        'It increases the landing distance because of extra drag'
      ],
      answer: 0,
      explanation:
        'Flaps add lift and drag, so the approach can be flown slower and steeper and the roll is shorter, but the nose sits low and there is less margin for a baulked landing. That is why many operators set take-off flap for a go-around rather than keeping full flap.',
      source: 'FAA PHAK Ch. 6'
    },
    {
      id: 'principles-006',
      subject: 'Principles of Flight',
      question: 'A few feet above the runway during the flare, the aircraft floats and seems to want to keep flying. Why?',
      options: [
        'A tailwind shear close to the ground increases lift',
        'The increased air density near the surface raises lift',
        'The wing is in ground effect, with reduced downwash and less induced drag, so it needs less angle of attack and less power',
        'The flare increases the wing\'s angle of attack beyond the critical angle'
      ],
      answer: 2,
      explanation:
        'Within about one wingspan of the surface, the ground restricts downwash and tip vortices, cutting induced drag and giving a given wing more lift at a lower angle of attack. The result is float, so the power reduction has to be planned to touch down in the intended zone.',
      source: 'FAA PHAK Ch. 5'
    },
    {
      id: 'principles-007',
      subject: 'Principles of Flight',
      question: 'What does positive wing dihedral do?',
      options: [
        'Reduces the tendency to stall at the tips in a turn',
        'Increases the roll rate by giving the ailerons more leverage',
        'Provides lateral stability by creating more lift on the low wing in a sideslip',
        'Raises the cruise speed by reducing induced drag'
      ],
      answer: 2,
      explanation:
        'In a sideslip the low wing meets the airflow more squarely than the high wing, so it generates more lift and the aircraft rolls back toward level. This is lateral, dihedral-effect stability, not a roll-control input.',
      source: 'FAA PHAK Ch. 5'
    },
    {
      id: 'principles-008',
      subject: 'Principles of Flight',
      question: 'Flying toward the aft centre of gravity limit, what changes should the pilot expect?',
      options: [
        'Heavier control forces and a higher stall speed',
        'A shorter take-off run and better longitudinal stability',
        'Lower trim loads and lower cruising speed from the extra induced drag',
        'Lighter control forces and a slightly higher cruise speed, but less longitudinal stability and harder stall and spin recovery'
      ],
      answer: 3,
      explanation:
        'An aft CG shortens the moment arm of the tail, so the aircraft is less stable in pitch, control forces lighten and a little less downforce is needed, which can add a knot or two. The cost is weaker stall and spin recovery, so the forward part of the envelope suits training and gusty landings.',
      source: 'FAA PHAK Ch. 10'
    },
    {
      id: 'principles-009',
      subject: 'Principles of Flight',
      question: 'How does best glide speed vary with aircraft weight?',
      options: [
        'It stays the same, because the best lift-to-drag ratio is a fixed property of the wing',
        'It decreases with weight, because the heavier aircraft descends faster',
        'It stays the same until the aircraft is close to maximum weight, then rises sharply',
        'It increases with weight, roughly in proportion to the square root of the weight'
      ],
      answer: 3,
      explanation:
        'The best lift-to-drag ratio, and so the flattest glide angle, occurs at one angle of attack regardless of weight, so a heavier aircraft has to fly it faster. With 20 percent more weight, best glide speed rises by about 10 percent, so a known distance and not just the book speed matters.',
      source: 'FAA PHAK Ch. 5'
    },
    {
      id: 'principles-010',
      subject: 'Principles of Flight',
      question: 'Taking off behind a departing heavy aircraft, how should wake turbulence be avoided?',
      options: [
        'Rotate before the point where the heavier aircraft rotated and stay above its flight path',
        'Take off immediately behind it with full power to get off the ground quickly',
        'Stay on the runway centreline below its path so the vortices pass overhead',
        'Delay rotation until the same point it rotated, then climb at best angle of attack to out-climb the wake'
      ],
      answer: 0,
      explanation:
        'Wingtip vortices form at rotation and sink slowly behind and below the path, so rotating earlier and staying above and upwind keeps clear. On landing behind a heavier type, aim to touch down beyond its touchdown point and land before its rotation point.',
      source: 'FAA PHAK Ch. 14'
    }
  ];

  root.SUBJECTS = SUBJECTS;
  root.QUESTION_BANK = QUESTION_BANK;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUBJECTS: SUBJECTS, QUESTION_BANK: QUESTION_BANK };
  }
})(typeof window !== 'undefined' ? window : globalThis);
