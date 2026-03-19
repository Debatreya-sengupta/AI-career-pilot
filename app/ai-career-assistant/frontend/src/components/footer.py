from st.components.v1 import html

def footer():
    footer_html = """
    <style>
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            position: relative;
            bottom: 0;
            width: 100%;
        }
    </style>
    <div class="footer">
        <p>&copy; 2023 AI Career Assistant. All rights reserved.</p>
        <p>
            <a href="https://www.example.com/privacy" target="_blank">Privacy Policy</a> | 
            <a href="https://www.example.com/terms" target="_blank">Terms of Service</a>
        </p>
    </div>
    """
    html(footer_html, height=100)