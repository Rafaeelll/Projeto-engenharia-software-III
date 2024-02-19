import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import {Container, FileInfo, Preview} from './styles'
import {MdCheckCircle, MdLink, MdError} from 'react-icons/md'

const FileList = ()=>(
    <Container>
        <li>
            <FileInfo>
                <Preview src="http://localhost:3333/files/e68696bf7cd772492ee362f5e451443c-L-2767670-1653175663-7843.jpg"/>
                <div>
                    <strong>profile.png</strong>
                    <span>64kg <button onClick={()=>{}}>Excluir</button></span>
                </div>
            </FileInfo>
            <div>
                <CircularProgressbar
                    styles={{
                        root: {width: 24},
                        path: {stroke: '#7159c1'}
                    }}
                    strokeWidth={10}
                    percentage={60}
                />
                <a
                    href="http://localhost:3333/files/e68696bf7cd772492ee362f5e451443c-L-2767670-1653175663-7843.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MdLink style={{marginRight: 8}} size={24} color="#222"/>
                </a>
                <MdCheckCircle size={24} color="#78e5d5"/>
                <MdError size={24} color="#e57878"/>
            </div>
        </li>
    </Container>
)
export default FileList