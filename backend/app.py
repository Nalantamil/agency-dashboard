from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId
from config import get_database, Config
from models import Client, Project, Task, TeamMember, Report
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = Config.SECRET_KEY

# Get database
db = get_database()

# ===== HEALTH CHECK =====
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'success',
        'message': 'Server is running',
        'database': 'connected' if db is not None else 'disconnected'
    }), 200

# ===== CLIENTS ROUTES =====
@app.route('/api/clients', methods=['GET'])
def get_clients():
    """Get all clients"""
    try:
        clients = list(db['clients'].find({}, {'_id': 1, 'name': 1, 'email': 1, 'phone': 1, 'industry': 1, 'status': 1}))
        for client in clients:
            client['_id'] = str(client['_id'])
        return jsonify({'success': True, 'data': clients}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/clients', methods=['POST'])
def create_client():
    """Create new client"""
    try:
        data = request.json
        client = Client(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address', ''),
            city=data.get('city', ''),
            industry=data.get('industry', ''),
            budget=data.get('budget', ''),
            status=data.get('status', 'active')
        )
        result = db['clients'].insert_one(client.to_dict())
        return jsonify({'success': True, 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/clients/<client_id>', methods=['GET'])
def get_client(client_id):
    """Get single client"""
    try:
        client = db['clients'].find_one({'_id': ObjectId(client_id)})
        if client:
            client['_id'] = str(client['_id'])
            return jsonify({'success': True, 'data': client}), 200
        return jsonify({'success': False, 'error': 'Client not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    """Update client"""
    try:
        data = request.json
        result = db['clients'].update_one(
            {'_id': ObjectId(client_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'success': True, 'message': 'Client updated'}), 200
        return jsonify({'success': False, 'error': 'Client not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/clients/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    """Delete client"""
    try:
        result = db['clients'].delete_one({'_id': ObjectId(client_id)})
        if result.deleted_count:
            return jsonify({'success': True, 'message': 'Client deleted'}), 200
        return jsonify({'success': False, 'error': 'Client not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== PROJECTS ROUTES =====
@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all projects"""
    try:
        projects = list(db['projects'].find({}, {'_id': 1, 'clientName': 1, 'projectName': 1, 'status': 1, 'progress': 1, 'budget': 1}))
        for project in projects:
            project['_id'] = str(project['_id'])
        return jsonify({'success': True, 'data': projects}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/projects', methods=['POST'])
def create_project():
    """Create new project"""
    try:
        data = request.json
        project = Project(
            clientId=data.get('clientId'),
            clientName=data.get('clientName'),
            projectName=data.get('projectName'),
            description=data.get('description', ''),
            startDate=data.get('startDate', ''),
            endDate=data.get('endDate', ''),
            budget=data.get('budget', ''),
            spent=data.get('spent', 0),
            status=data.get('status', 'planning'),
            priority=data.get('priority', 'medium'),
            progress=data.get('progress', 0)
        )
        result = db['projects'].insert_one(project.to_dict())
        return jsonify({'success': True, 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    """Get single project"""
    try:
        project = db['projects'].find_one({'_id': ObjectId(project_id)})
        if project:
            project['_id'] = str(project['_id'])
            return jsonify({'success': True, 'data': project}), 200
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    """Update project"""
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # Remove _id and id fields to prevent MongoDB error
        data.pop('_id', None)
        data.pop('id', None)

        result = db['projects'].update_one(
            {'_id': ObjectId(project_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'success': True, 'message': 'Project updated'}), 200
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    except Exception as e:
        print(f"DEBUG: Exception error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Delete project"""
    try:
        result = db['projects'].delete_one({'_id': ObjectId(project_id)})
        if result.deleted_count:
            return jsonify({'success': True, 'message': 'Project deleted'}), 200
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== TASKS ROUTES =====
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    try:
        tasks = list(db['tasks'].find({}, {'_id': 1, 'taskName': 1, 'projectName': 1, 'status': 1, 'priority': 1}))
        for task in tasks:
            task['_id'] = str(task['_id'])
        return jsonify({'success': True, 'data': tasks}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create new task"""
    try:
        data = request.json
        task = Task(
            projectId=data.get('projectId'),
            projectName=data.get('projectName'),
            taskName=data.get('taskName'),
            description=data.get('description', ''),
            assignedTo=data.get('assignedTo', ''),
            dueDate=data.get('dueDate', ''),
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'todo'),
            estimatedHours=data.get('estimatedHours', 0),
            actualHours=data.get('actualHours', 0)
        )
        result = db['tasks'].insert_one(task.to_dict())
        return jsonify({'success': True, 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    """Get single task"""
    try:
        task = db['tasks'].find_one({'_id': ObjectId(task_id)})
        if task:
            task['_id'] = str(task['_id'])
            return jsonify({'success': True, 'data': task}), 200
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update task"""
    try:
        data = request.json
        result = db['tasks'].update_one(
            {'_id': ObjectId(task_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'success': True, 'message': 'Task updated'}), 200
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete task"""
    try:
        result = db['tasks'].delete_one({'_id': ObjectId(task_id)})
        if result.deleted_count:
            return jsonify({'success': True, 'message': 'Task deleted'}), 200
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== TEAM ROUTES =====
@app.route('/api/team', methods=['GET'])
def get_team():
    """Get all team members"""
    try:
        team = list(db['team'].find({}))  # ← fetch ALL fields, no filter
        for member in team:
            member['_id'] = str(member['_id'])
        return jsonify({'success': True, 'data': team}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/team', methods=['POST'])
def create_team_member():
    """Create new team member"""
    try:
        data = request.json
        member = TeamMember(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            role=data.get('role'),
            department=data.get('department'),
            joinDate=data.get('joinDate', ''),
            status=data.get('status', 'active'),
            assignedProjects=data.get('assignedProjects', []),
            tasksCompleted=data.get('tasksCompleted', 0),
            hoursLogged=data.get('hoursLogged', 0)
        )
        result = db['team'].insert_one(member.to_dict())
        return jsonify({'success': True, 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/team/<member_id>', methods=['GET'])
def get_team_member(member_id):
    """Get single team member"""
    try:
        member = db['team'].find_one({'_id': ObjectId(member_id)})
        if member:
            member['_id'] = str(member['_id'])
            return jsonify({'success': True, 'data': member}), 200
        return jsonify({'success': False, 'error': 'Team member not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/team/<member_id>', methods=['PUT'])
def update_team_member(member_id):
    """Update team member"""
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        # Remove _id and id to prevent MongoDB error
        data.pop('_id', None)
        data.pop('id', None)

        result = db['team'].update_one(
            {'_id': ObjectId(member_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'success': True, 'message': 'Team member updated'}), 200
        return jsonify({'success': False, 'error': 'Team member not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/team/<member_id>', methods=['DELETE'])
def delete_team_member(member_id):
    """Delete team member"""
    try:
        result = db['team'].delete_one({'_id': ObjectId(member_id)})
        if result.deleted_count:
            return jsonify({'success': True, 'message': 'Team member deleted'}), 200
        return jsonify({'success': False, 'error': 'Team member not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== REPORTS ROUTES =====
@app.route('/api/reports', methods=['GET'])
def get_reports():
    """Get all reports"""
    try:
        reports = list(db['reports'].find({}))
        for report in reports:
            report['_id'] = str(report['_id'])
        return jsonify({'success': True, 'data': reports}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/reports', methods=['POST'])
def create_report():
    """Create new report"""
    try:
        data = request.json
        report = Report(
            projectId=data.get('projectId'),
            projectName=data.get('projectName'),
            reportType=data.get('reportType', 'Monthly'),
            totalTasks=data.get('totalTasks', 0),
            completedTasks=data.get('completedTasks', 0),
            ongoingTasks=data.get('ongoingTasks', 0),
            blockedTasks=data.get('blockedTasks', 0),
            budgetStatus=data.get('budgetStatus', ''),
            timelineStatus=data.get('timelineStatus', ''),
            progress=data.get('progress', 0),
            budgetSpent=data.get('budgetSpent', 0),
            budgetTotal=data.get('budgetTotal', 0),
            summary=data.get('summary', '')
        )
        result = db['reports'].insert_one(report.to_dict())
        return jsonify({'success': True, 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """Get single report"""
    try:
        report = db['reports'].find_one({'_id': ObjectId(report_id)})
        if report:
            report['_id'] = str(report['_id'])
            return jsonify({'success': True, 'data': report}), 200
        return jsonify({'success': False, 'error': 'Report not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/reports/<report_id>', methods=['PUT'])
def update_report(report_id):
    """Update report"""
    try:
        data = request.json
        data.pop('_id', None)
        data.pop('id', None)
        result = db['reports'].update_one(
            {'_id': ObjectId(report_id)},
            {'$set': data}
        )
        if result.matched_count:
            return jsonify({'success': True, 'message': 'Report updated'}), 200
        return jsonify({'success': False, 'error': 'Report not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    """Delete report"""
    try:
        result = db['reports'].delete_one({'_id': ObjectId(report_id)})
        if result.deleted_count:
            return jsonify({'success': True, 'message': 'Report deleted'}), 200
        return jsonify({'success': False, 'error': 'Report not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
# ===== ERROR HANDLING =====
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'success': False, 'error': 'Server error'}), 500

if __name__ == '__main__':
    if db is not None:
        print("✓ Backend is ready!")
        print("✓ MongoDB connected")
        print("✓ Starting Flask server on http://localhost:5000")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("✗ Failed to connect to MongoDB")
        print("✗ Make sure MongoDB is running")    
