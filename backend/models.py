from datetime import datetime
from bson import ObjectId

class Client:
    """Client model"""
    def __init__(self, name, email, phone, address='', city='', industry='', budget='', status='active'):
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
        self.city = city
        self.industry = industry
        self.budget = budget
        self.status = status
        self.createdAt = datetime.now()

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'industry': self.industry,
            'budget': self.budget,
            'status': self.status,
            'createdAt': self.createdAt
        }

class Project:
    """Project model"""
    def __init__(self, clientId, clientName, projectName, description='', startDate='', endDate='', 
                 budget='', spent=0, status='planning', priority='medium', progress=0):
        self.clientId = clientId
        self.clientName = clientName
        self.projectName = projectName
        self.description = description
        self.startDate = startDate
        self.endDate = endDate
        self.budget = budget
        self.spent = spent
        self.status = status
        self.priority = priority
        self.progress = progress
        self.createdAt = datetime.now()

    def to_dict(self):
        return {
            'clientId': self.clientId,
            'clientName': self.clientName,
            'projectName': self.projectName,
            'description': self.description,
            'startDate': self.startDate,
            'endDate': self.endDate,
            'budget': self.budget,
            'spent': self.spent,
            'status': self.status,
            'priority': self.priority,
            'progress': self.progress,
            'createdAt': self.createdAt
        }

class Task:
    """Task model"""
    def __init__(self, projectId, projectName, taskName, description='', assignedTo='', 
                 dueDate='', priority='medium', status='todo', estimatedHours=0, actualHours=0):
        self.projectId = projectId
        self.projectName = projectName
        self.taskName = taskName
        self.description = description
        self.assignedTo = assignedTo
        self.dueDate = dueDate
        self.priority = priority
        self.status = status
        self.estimatedHours = estimatedHours
        self.actualHours = actualHours
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()

    def to_dict(self):
        return {
            'projectId': self.projectId,
            'projectName': self.projectName,
            'taskName': self.taskName,
            'description': self.description,
            'assignedTo': self.assignedTo,
            'dueDate': self.dueDate,
            'priority': self.priority,
            'status': self.status,
            'estimatedHours': self.estimatedHours,
            'actualHours': self.actualHours,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }

class TeamMember:
    """Team member model"""
    def __init__(self, name, email, phone, role, department, joinDate='', status='active', 
                 assignedProjects=None, tasksCompleted=0, hoursLogged=0):
        self.name = name
        self.email = email
        self.phone = phone
        self.role = role
        self.department = department
        self.joinDate = joinDate
        self.status = status
        self.assignedProjects = assignedProjects or []
        self.tasksCompleted = tasksCompleted
        self.hoursLogged = hoursLogged

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'department': self.department,
            'joinDate': self.joinDate,
            'status': self.status,
            'assignedProjects': self.assignedProjects,
            'tasksCompleted': self.tasksCompleted,
            'hoursLogged': self.hoursLogged
        }

class Report:
    """Report model"""
    def __init__(self, projectId, projectName, reportType, totalTasks=0, completedTasks=0, 
                 ongoingTasks=0, blockedTasks=0, budgetStatus='', timelineStatus='', 
                 progress=0, budgetSpent=0, budgetTotal=0, summary=''):
        self.projectId = projectId
        self.projectName = projectName
        self.reportType = reportType
        self.generatedDate = datetime.now()
        self.totalTasks = totalTasks
        self.completedTasks = completedTasks
        self.ongoingTasks = ongoingTasks
        self.blockedTasks = blockedTasks
        self.budgetStatus = budgetStatus
        self.timelineStatus = timelineStatus
        self.progress = progress
        self.budgetSpent = budgetSpent
        self.budgetTotal = budgetTotal
        self.summary = summary

    def to_dict(self):
        return {
            'projectId': self.projectId,
            'projectName': self.projectName,
            'reportType': self.reportType,
            'generatedDate': self.generatedDate,
            'totalTasks': self.totalTasks,
            'completedTasks': self.completedTasks,
            'ongoingTasks': self.ongoingTasks,
            'blockedTasks': self.blockedTasks,
            'budgetStatus': self.budgetStatus,
            'timelineStatus': self.timelineStatus,
            'progress': self.progress,
            'budgetSpent': self.budgetSpent,
            'budgetTotal': self.budgetTotal,
            'summary': self.summary
        }
