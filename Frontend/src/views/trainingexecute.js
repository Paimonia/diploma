import React from 'react'
import withRouter from '../shared/withrouter'

class TrainingExecute extends React.Component {

    constructor(props) {           
        super(props);
        this.state = { 
                            
        }      
        
        this.id =  this.props.params.id 
    }

    componentDidMount() {
        this.uploadData()
    }

    // загрузка данных
    uploadData = () => {        
    }

    render() {
        return (
            <div>
                <h1>Экран выполнения тренировки {this.id}</h1>            
            </div>
        )
    }
}

export default withRouter(TrainingExecute);