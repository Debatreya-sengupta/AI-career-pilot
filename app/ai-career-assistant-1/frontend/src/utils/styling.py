from typing import Dict, Any

def set_background_color(color: str) -> Dict[str, str]:
    return {
        "backgroundColor": color
    }

def set_text_style(font_size: int, font_weight: str) -> Dict[str, Any]:
    return {
        "fontSize": f"{font_size}px",
        "fontWeight": font_weight
    }

def create_button_style(padding: str, border_radius: int) -> Dict[str, Any]:
    return {
        "padding": padding,
        "borderRadius": f"{border_radius}px",
        "backgroundColor": "#4CAF50",
        "color": "white",
        "border": "none",
        "cursor": "pointer"
    }

def create_card_style() -> Dict[str, Any]:
    return {
        "backgroundColor": "white",
        "border": "1px solid #e0e0e0",
        "borderRadius": "8px",
        "padding": "16px",
        "boxShadow": "0 2px 4px rgba(0, 0, 0, 0.1)"
    }

def create_header_style() -> Dict[str, Any]:
    return {
        "backgroundColor": "#f5f5f5",
        "padding": "10px",
        "textAlign": "center",
        "borderBottom": "1px solid #e0e0e0"
    }