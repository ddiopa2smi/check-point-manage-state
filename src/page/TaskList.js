import React, { useEffect, useState } from 'react'
import { getListTasks } from '../services/tasksService';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { Button, Col, Form, Row, Stack, Table } from 'react-bootstrap';
import { PencilFill, Trash2Fill } from 'react-bootstrap-icons';
import ModalComp from '../components/ModalComp';


const initialesValues = {
    "name": "",
    "description": "",
    "completed": false
}


export default function TaskList() {

    const [taskList, setTaskList] = useState([]);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [values, setValues] = useState(initialesValues);
    const [x, setX] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getListTasks();
                setTaskList(response.data);
                console.log(taskList);

            } catch (error) {
                setError(error);
            }
        }

        fetchData();
    }, [x])

    const handleClose = () => { setShow(false); setValues(initialesValues) }
    const handleShow = () => setShow(true);

    const onEditTask = (row) => {
        console.log(row);

        setValues(row);
        handleShow();

    }

    // const handleUpdate = (id, newValue) => {
    //     setData(data.map((user) => user.id === id ? newValue : user));
    //     // setShowToast(true);
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values !== "") {
            setTaskList([...taskList, values]);
            setValues(initialesValues);
        } else {
            alert("fonctionnalite en cours");
            handleClose();
        }

    }

    const handleRefresh = () => {
        setX(Math.random());
        // setSearch(null);
    }

    const handleDelete = ((row) => {
        setTaskList(taskList.filter((user) => user.name !== row.name))
    })

    const handleInputChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const form = (
        <Form onSubmit={handleSubmit}>
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Completed ?"
                reverse={true}
                value={values.completed}
            />
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="task name"
                    name='name'
                    value={values.name}
                    onChange={(e) => handleInputChange(e)}
                    required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3}
                    name='description'
                    value={values.description}
                    onChange={(e) => handleInputChange(e)}
                    required />
            </Form.Group>

            <Row className="mb-3">
                <Button variant="success" type="submit" block>
                    {values.name == "" ? 'Add New Task' : 'Update Task'}
                </Button>
            </Row>
        </Form>
    )

    return (
        <div>
            <Container>

                <Alert style={{ marginBottom: '10px', marginTop: '5px' }} variant='success'>
                    <h2 style={{ textAlign: 'center' }}>List of Tasks</h2>
                </Alert>
                <Stack direction="horizontal" gap={3} style={{ textAlign: 'end', marginBottom: '10px' }}>
                    <Form.Control className="me-auto" placeholder="Search By Name..." />
                    <Button variant="outline-success" onClick={handleShow} style={{ width: '150px' }}>Add New</Button>
                    <div className="vr" />
                    <Button variant="outline-danger" onClick={handleRefresh}>Refresh</Button>

                </Stack>
                <Table striped bordered hover >
                    <thead >
                        <tr style={{ backgroundColor: 'green' }}>

                            <th >#</th>
                            <th >Name</th>
                            <th>Description</th>
                            <th>Completed</th>

                        </tr>
                    </thead>
                    <tbody>
                        {taskList.map((task, index) =>
                        (<tr>
                            <td>{index + 1}</td>
                            <td>{task.name}</td>
                            <td>{task.description}</td>
                            <td align='center'><Form.Check // prettier-ignore
                                type="switch"
                                id="custom-switch"
                                checked={task.completed}
                            /></td>
                            <td align='center'>
                                <button type="button" onClick={() => onEditTask(task)} class="btn btn-outline-primary btn-sm me-2" ><PencilFill /></button>
                                <button type="button" onClick={() => handleDelete(task)} class="btn btn-outline-danger btn-sm " ><Trash2Fill /></button>
                            </td>
                        </tr>))}

                    </tbody>
                </Table>

                <ModalComp
                    show={show}
                    onHide={handleClose}
                    title={values.name == "" ? 'Add New Task' : `Update Task `}
                    onClick={handleClose}
                    contentBody={form}
                />
            </Container>
        </div>

    )
}
