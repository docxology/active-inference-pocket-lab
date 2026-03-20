/**
 * @file InferenceSlider.jsx — Touch-Optimized Interactive Slider
 * @description The primary interaction element of Spin.
 * Every module starts with a physical action — this slider is that action.
 * Large touch target, visual feedback, real-time value display.
 *
 * Philosophy: "The First Threshold" — no walls of text, start with action.
 *
 * @module components/interactive/InferenceSlider
 */
import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import './InferenceSlider.css';

/**
 * InferenceSlider — Touch-optimized range slider with visual feedback.
 *
 * @param {Object} props
 * @param {number} [props.min=0] - Minimum value
 * @param {number} [props.max=100] - Maximum value
 * @param {number} [props.step=1] - Step increment
 * @param {number} [props.value] - Controlled value
 * @param {number} [props.defaultValue=50] - Initial value (uncontrolled)
 * @param {string} [props.label] - Accessible label
 * @param {string} [props.leftLabel] - Label for minimum end
 * @param {string} [props.rightLabel] - Label for maximum end
 * @param {string} [props.unit] - Unit suffix for display
 * @param {string} [props.color] - Stream color accent
 * @param {Function} [props.onChange] - Value change handler
 * @param {Function} [props.formatValue] - Custom value formatter
 * @returns {JSX.Element}
 */
export default function InferenceSlider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  label = 'Adjust',
  leftLabel,
  rightLabel,
  unit = '',
  color = 'var(--color-pulse)',
  onChange,
  formatValue,
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isInteracting, setIsInteracting] = useState(false);
  const inputRef = useRef(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const percentage = ((value - min) / (max - min)) * 100;

  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  const handleChange = useCallback(
    (e) => {
      const newValue = Number(e.target.value);
      setInternalValue(newValue);
      onChange?.(newValue);
      console.log(`[InferenceSlider] "${label}" → ${newValue}${unit}`);
    },
    [onChange, label, unit],
  );

  return (
    <div
      className={`inference-slider ${isInteracting ? 'interacting' : ''}`}
      style={{ '--slider-color': color, '--slider-percentage': `${percentage}%` }}
    >
      {/* Value Display */}
      <motion.div
        className="inference-slider__value-display"
        animate={{ scale: isInteracting ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span className="inference-slider__value">{displayValue}</span>
      </motion.div>

      {/* Label */}
      <label className="inference-slider__label" htmlFor={`slider-${label}`}>
        {label}
      </label>

      {/* Track + Input */}
      <div className="inference-slider__track-container">
        <div className="inference-slider__track">
          <div className="inference-slider__fill" />
          <motion.div
            className="inference-slider__thumb-glow"
            animate={{
              opacity: isInteracting ? 1 : 0.5,
              scale: isInteracting ? 1.5 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ left: `${percentage}%` }}
          />
        </div>
        <input
          ref={inputRef}
          id={`slider-${label}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
          onPointerLeave={() => setIsInteracting(false)}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
        />
      </div>

      {/* Range Labels */}
      {(leftLabel || rightLabel) && (
        <div className="inference-slider__range-labels">
          <span className="inference-slider__range-label">{leftLabel || min}</span>
          <span className="inference-slider__range-label">{rightLabel || max}</span>
        </div>
      )}
    </div>
  );
}
