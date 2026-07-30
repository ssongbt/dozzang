import React from 'react';

const FooterComponent = () => {
    return(
        <div id="footer">
            <div className="wrap">
                <div className="footer-gap">
                    <div className="footer-wrap">
                        <p className="footer-notice">
                            데이터는 이 기기(브라우저)에만 저장됩니다.
                            <br />
                            헤더의 백업 · 복원으로 다른 기기에서도 이어서 쓸 수 있습니다.
                        </p>
                        <p className="footer-meta">
                            <a className="footer-contact-value" href="mailto:better.lab.dev@gmail.com">문의 · 건의하기</a>
                            <span className="footer-divider">·</span>
                            <span>© 2026 better.lab.dev</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default FooterComponent;