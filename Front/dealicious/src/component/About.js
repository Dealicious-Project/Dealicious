const About = () => {
    return (
        <div className='main' style={{ overflow: "scroll", height: "632px", overflowX: "hidden", padding: "0px 0px 0px 0px" }}>
            <div style={{ backgroundColor: "#B8F1B0", width: "430px", height: "300px", display:"flex" }}>
                <div style={{width:"230px"}}>
                    딜리셔스란?<br/>
                    dkswjs
                </div>
                <div style={{textAlign:"right"}}>
                    <img src="/ggulee.png" style={{ width: "200px", marginTop:"100px" }} />
                </div>
            </div>
            <div style={{ backgroundColor: "#F9F9F9", width: "430px", height: "300px" }}>
                <img src="/ggulggulee.png" style={{ width: "300px" }} />
            </div>
            <div style={{ backgroundColor: "#E3FCBF", width: "430px", height: "300px" }}>
                <img src="/ggulee.png" style={{ width: "300px" }} />
            </div>
            <div style={{ height: "200px", lineHeight: "200px", color: "lightgray" }}>
                Footer
                김형섭 이유진 박철현
            </div>
        </div>
    )
}


export default About;