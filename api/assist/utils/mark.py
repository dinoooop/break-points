from ast import mod
from datetime import datetime, timezone

from break_point.models import BreakPoint

# Get diff values from th


# end_reading is today
# end_reading (mode = reading_type) latest value given in subject
# last : DB value from subject > last_end_date or last_end_reading
def update_current_bp_counts(current_bp, subject):
    
    th = subject.threshold
    prev_bp = BreakPoint.objects.filter(
            subject=subject,
            id__lt=current_bp.id
        ).order_by("-id").first()
    
    if subject.mode == 'date_type':
        # find last bp for the subject
        if prev_bp is not None:
            cv = (current_bp.end_date - prev_bp.end_date).days
            bp_counts = get_rm_ex(cv, th)
        else:
            # first bp for the subject.
            bp_counts = get_rm_ex(0, th)
            
        current_bp.th = bp_counts["th"]
        current_bp.cv = bp_counts["cv"]
        current_bp.rm = bp_counts["rm"]
        current_bp.ex = bp_counts["ex"]
        current_bp.save()
    
    # READING_TYPE
    else:
        if prev_bp is not None:
            cv = current_bp.end_reading - prev_bp.end_reading
            bp_counts = get_rm_ex(cv, th)
        else:
            # first bp for the subject.
            bp_counts = get_rm_ex(0, th)
            
        current_bp.th = bp_counts["th"]
        current_bp.cv = bp_counts["cv"]
        current_bp.rm = bp_counts["rm"]
        current_bp.ex = bp_counts["ex"]
        current_bp.save()
    

def get_rm_ex(cv, th):
    if cv <= th :
        ex = 0
        rm = abs(th - cv)
    else:
        # over read
        ex = abs(cv - th)
        rm = 0 

    return {
        'th': th,
        'cv': cv,
        'rm': rm,
        'ex': ex,
    }


def update_subject_category_for_bp_changes(subject):
    last_bp = BreakPoint.objects.filter(subject=subject).order_by("-id").first()
    
    if last_bp is None:
        return
        
    if subject.mode == 'date_type':
        subject.last_end_date = last_bp.end_date
    else:
        subject.last_end_reading = last_bp.end_reading
        
        if subject.category:
            category = subject.category
            if category.category_current_reading < last_bp.end_reading:
                category.category_current_reading = last_bp.end_reading
            category.save()
    subject.save()


    